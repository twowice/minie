'use client';

import { CartItem } from '@/app/api/cart/cart';
import { useUser } from '@/context/UserContext';
import { addCartItems, deleteAllCartItems, deleteCartItem, getCartItems, updateCartItems } from '@/lib/minie/cartAPI';
import { addLikedItem, deleteAllLikedItem, deleteLikedItem, getLikedItems } from '@/lib/minie/likeAPI';
import { useContext, createContext, ReactNode, useState, useCallback, useMemo, useEffect } from 'react';

// Context 내부용 확장 타입
type ContextCartItem = CartItem & {
   quantity?: number | string;
   discount?: number | string;
   discount_amount?: number | string;
   [key: string]: any;
};

interface CartContextDataType {
   totalPrice: number;
   cartItems: CartItem[];
   likedItems: CartItem[];
   toggleChecked: (id: number, type: 'cart' | 'like') => void;
   toggleAllChecked: (type: 'cart' | 'like') => void;
   updateQuantity: (itemId: number, type: 'plus' | 'minus') => void;
   updateAllQuantities: () => void;
   removeItem: (itemId: number) => void;
   clear: (type: string) => void;
   toggleLike: (item: CartItem) => void;
   toggleCart: (item: CartItem) => void;
   addLikedItemsToCart: () => void;
   isLiked: (itemId: number) => boolean;
   isItemCart: (itemId: number) => boolean;
   addToCart: (item: ContextCartItem) => Promise<void>;
   paymentItems: CartItem[];
   paymentTotal: number;
   buyNow: (item: CartItem) => void;
   totalDiscountAmount: number;
   totalCostPrice: number;
   refreshCart: () => Promise<void>;
   resetDirectOrder: () => void;
}

export const CartContext = createContext<CartContextDataType | undefined>(undefined);

export function useCart() {
   const context = useContext(CartContext);
   if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
   }
   return context;
}

interface CartProviderProps {
   children: ReactNode;
   initialCartItems?: CartItem[];
   initialLikedItems?: CartItem[];
}
// 초기설정
const initializeState = (items: CartItem[]): CartItem[] => {
  return items.map((item) => ({
    ...item,
    num: (item as any).num || 1,
    checked: false,
  }));
};
//

export function CartProvider({ children }: CartProviderProps) {
   const [cartItems, setCartItems] = useState<CartItem[]>([]);
   const [likedItems, setLikedItems] = useState<CartItem[]>([]);
   const [cartDataLoading, setCartDataLoading] = useState(true);

   // 바로구매 아이템 상태 (장바구니와 분리)
   const [directOrderItem, setDirectOrderItem] = useState<CartItem | null>(null);

   const { user, loading: userLoading } = useUser();

   // 안전한 숫자 변환 함수
   const getSafeNumber = (val: any) => {
      if (val === null || val === undefined) return 0;
      const str = String(val).replace(/,/g, '');
      const num = Number(str);
      return isNaN(num) ? 0 : num;
   };

   // 장바구니 총액 계산 (checked된 것만)
   const { totalCostPrice, totalDiscountAmount, totalPrice } = useMemo(() => {
      const checkedItems = cartItems.filter(item => item.checked);

      const cost = checkedItems.reduce((acc, item) => {
         const price = getSafeNumber(item.price);
         const qty = getSafeNumber(item.num ?? 1);
         return acc + price * qty;
      }, 0);

      const discount = checkedItems.reduce((acc, item) => {
         const val = getSafeNumber(item.discount_amount ?? 0);
         const qty = getSafeNumber(item.num ?? 1);
         return acc + val * qty;
      }, 0);

      return {
         totalCostPrice: cost,
         totalDiscountAmount: discount,
         totalPrice: cost - discount,
      };
   }, [cartItems]);

   // 👇 [핵심 수정] 바로 구매 함수
   // setCartItems를 호출하지 않고 directOrderItem만 업데이트합니다.
   const buyNow = (newItem: ContextCartItem) => {
      // 1. 데이터 정제
      const cleanItem: ContextCartItem = {
         ...newItem,
         id: Number(newItem.id),
         price: getSafeNumber(newItem.price),
         // num과 quantity 둘 다 값을 채워줍니다.
         num: getSafeNumber(newItem.quantity ?? newItem.num ?? 1),
         quantity: getSafeNumber(newItem.quantity ?? newItem.num ?? 1),
         checked: true, // 결제창에서는 무조건 체크
         discount_amount: getSafeNumber(newItem.discount_amount),
         title: newItem.title ?? newItem.name ?? '',
         image: newItem.image ?? '',
         brand: newItem.brand ?? '',
      };

      // 2. 상태 업데이트 (장바구니 리스트는 건드리지 않음!)
      setDirectOrderItem(cleanItem);

      // 3. 로컬스토리지 저장 (새로고침 대비)
      localStorage.setItem('buyNowItem', JSON.stringify(cleanItem));
   };

   // 👇 [핵심] 페이지 로드 시 바로구매 데이터 복구
   // init 함수와 별개로 실행되어야 결제 페이지 진입 시 즉시 데이터를 보여줍니다.
   useEffect(() => {
      const storedBuyNow = localStorage.getItem('buyNowItem');
      if (storedBuyNow) {
         try {
            setDirectOrderItem(JSON.parse(storedBuyNow));
         } catch (e) {
            console.error('바로구매 데이터 파싱 실패', e);
            localStorage.removeItem('buyNowItem');
         }
      }
   }, []);

   // 결제 아이템 결정 로직
   const paymentItems = useMemo(() => {
      // 바로구매 데이터가 있으면 그것만 반환
      if (directOrderItem) return [directOrderItem];
      // 없으면 장바구니 체크된 항목 반환
      return cartItems.filter(item => item.checked);
   }, [directOrderItem, cartItems]);

   // 결제 총액 계산
   const paymentTotal = useMemo(() => {
      return paymentItems.reduce((sum, item) => {
         const price = getSafeNumber(item.price);
         const discount = getSafeNumber(item.discount_amount);
         const num = getSafeNumber(item.num ?? item.quantity ?? 1);
         return sum + (price - discount) * num;
      }, 0);
   }, [paymentItems]);

   // 초기화 로직 (서버 데이터 로드)
   const init = useCallback(async () => {
      if (userLoading) return;

      setCartDataLoading(true);
      try {
         if (user) {
            const [initialCartItems, initialLikedItems] = await Promise.all([getCartItems(), getLikedItems()]);

            const normalize = (item: any): ContextCartItem => ({
               ...item,
               id: Number(item.id),
               price: getSafeNumber(item.price),
               discountAmount: getSafeNumber(item.discount_amount),
               num: getSafeNumber(item.num ?? item.product_num ?? 1),
               checked: Boolean(item.checked),
               title: item.title ?? item.name ?? '',
               brand: item.brand ?? '',
               image: item.image ?? '',
            });
            setCartItems(initialCartItems.map(normalize));
            setLikedItems(initialLikedItems.map(normalize));
         } else {
            setCartItems([]);
            setLikedItems([]);
         }
         // *여기 있던 storedBuyNow 로직 제거됨 (위쪽 useEffect로 이동)*
      } catch (error) {
         console.error('초기화 실패:', error);
         setCartItems([]);
         setLikedItems([]);
      } finally {
         setCartDataLoading(false);
      }
   }, [user, userLoading]);

   useEffect(() => {
      init();
   }, [init]);

   const refreshCart = async () => {
      try {
         const cartItemIds = new Set(cartItems.map(item => item.id));
         const updatedCartItems = (await getCartItems()).map((item: any) => ({
            ...item,
            id: Number(item.id),
            checked: cartItemIds.has(Number(item.id))
               ? (cartItems.find(c => c.id === Number(item.id))?.checked ?? false)
               : false,
         }));
         setCartItems(updatedCartItems as ContextCartItem[]);
      } catch (error) {
         console.error('Refresh Error:', error);
      }
   };

   // 바로 구매 초기화 (결제 완료/취소 후 호출)
   const resetDirectOrder = useCallback(() => {
      setDirectOrderItem(null);
      localStorage.removeItem('buyNowItem');
   }, []);

   // 일반 장바구니 담기 (바로구매 상태 초기화 포함)
   const addToCart = useCallback(
      async (newItem: ContextCartItem) => {
         setDirectOrderItem(null); // 장바구니 이용 시 바로구매 상태 해제

         const targetId = Number(newItem.id);
         const existing = cartItems.find(item => item.id === targetId);
         const addQty = getSafeNumber(newItem.num ?? newItem.quantity ?? 1);

         if (existing) {
            const newQty = getSafeNumber(existing.num) + addQty;
            setCartItems(prev => prev.map(i => (i.id === targetId ? { ...i, num: newQty } : i)));
            await updateCartItems([{ product_id: targetId, product_num: newQty }]);
         } else {
            const itemToAdd: ContextCartItem = { ...newItem, id: targetId, num: addQty, checked: true };
            setCartItems(prev => [itemToAdd, ...prev]);
            await addCartItems([{ product_id: targetId, product_num: addQty }]);
         }
      },
      [cartItems],
   );

   // ... (나머지 함수들은 기존 로직 유지) ...
   const likedItemIds = useMemo(() => new Set(likedItems.map(item => item.id)), [likedItems]);
   const isLiked = (itemId: number) => likedItemIds.has(itemId);
   const cartItemIds = useMemo(() => new Set(cartItems.map(item => item.id)), [cartItems]);
   const isItemCart = (itemId: number) => cartItemIds.has(itemId);

   const toggleChecked = useCallback((id: number, type: 'cart' | 'like') => {
      const setState = type === 'cart' ? setCartItems : setLikedItems;
      setState(prev => prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item)));
   }, []);

   const toggleAllChecked = useCallback(
      (type: 'cart' | 'like') => {
         const [items, setState] = type === 'cart' ? [cartItems, setCartItems] : [likedItems, setLikedItems];
         const isAllChecked = items.length > 0 && items.every(item => item.checked);
         setState(prev => prev.map(item => ({ ...item, checked: !isAllChecked })));
      },
      [cartItems, likedItems],
   );

   const updateQuantity = useCallback(async (itemId: number, type: 'plus' | 'minus') => {
      setCartItems(prev =>
         prev.map(item => {
            if (item.id === itemId) {
               const currentNum = getSafeNumber(item.num);
               const newNum = type === 'plus' ? currentNum + 1 : Math.max(1, currentNum - 1);
               return { ...item, num: newNum };
            }
            return item;
         }),
      );
      await updateCartItems([{ product_id: itemId, product_num: 1 }]);
   }, []);

   const updateAllQuantities = useCallback(async () => {
      const payload = cartItems.map(item => ({ product_id: item.id, product_num: getSafeNumber(item.num) }));
      await updateCartItems(payload);
   }, [cartItems]);

   const removeItem = useCallback(async (itemId: number) => {
      const isSuccess = await deleteCartItem(itemId);
      if (isSuccess) setCartItems(prev => prev.filter(item => item.id !== itemId));
   }, []);

   const clear = useCallback(async (type: string) => {
      if (type === 'cart') await deleteAllCartItems().then(res => res && setCartItems([]));
      if (type === 'like') await deleteAllLikedItem().then(res => res && setLikedItems([]));
   }, []);

   const toggleLike = useCallback(
      async (item: CartItem) => {
         const targetId = Number(item.id);
         if (isLiked(targetId)) {
            await deleteLikedItem(targetId).then(
               res => res && setLikedItems(prev => prev.filter(i => i.id !== targetId)),
            );
         } else {
            await addLikedItem(targetId).then(
               res => res && setLikedItems(prev => [{ ...item, checked: false }, ...prev]),
            );
         }
      },
      [isLiked],
   );

   const toggleCart = useCallback(
      async (item: CartItem) => {
         const targetId = Number(item.id);
         if (isItemCart(targetId)) {
            await deleteCartItem(targetId).then(
               res => res && setCartItems(prev => prev.filter(i => i.id !== targetId)),
            );
         } else {
            await addCartItems([{ product_id: targetId, product_num: 1 }]).then(
               res => res && setCartItems(prev => [{ ...item, checked: false, num: 1 }, ...prev]),
            );
         }
      },
      [isItemCart],
   );

   const addLikedItemsToCart = useCallback(async () => {
      const itemsToAdd = likedItems.filter(item => item.checked);
      const existingIds = new Set(cartItems.map(i => i.id));
      const newItems = itemsToAdd.filter(item => !existingIds.has(item.id));
      const payload = newItems.map(item => ({ product_id: item.id, product_num: getSafeNumber(item.num ?? 1) }));
      const isSuccess = await addCartItems(payload);
      if (isSuccess) {
         setCartItems(prev => [...newItems.map(i => ({ ...i, checked: false })), ...prev]);
         setLikedItems(prev => prev.map(item => ({ ...item, checked: false })));
      }
   }, [likedItems, cartItems]);

   const value = {
      cartItems,
      likedItems,
      toggleChecked,
      toggleAllChecked,
      updateQuantity,
      updateAllQuantities,
      removeItem,
      clear,
      toggleLike,
      addToCart,
      addLikedItemsToCart,
      isLiked,
      isItemCart,
      toggleCart,
      totalPrice,
      paymentItems,
      paymentTotal,
      buyNow,
      totalDiscountAmount,
      totalCostPrice,
      refreshCart,
      resetDirectOrder,
   };

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

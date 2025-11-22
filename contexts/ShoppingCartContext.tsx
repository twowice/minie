'use client';

import { CartItem } from '@/app/api/cart/cart';
import { useUser } from '@/context/UserContext';
import { addCartItems, deleteAllCartItems, deleteCartItem, getCartItems, updateCartItems } from '@/lib/minie/cartAPI';
import { addLikedItem, deleteAllLikedItem, deleteLikedItem, getLikedItems } from '@/lib/minie/likeAPI';
import { useContext, createContext, ReactNode, useState, useCallback, useMemo, useEffect } from 'react';

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
   addToCart: (item: CartItem) => Promise<void>;
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
   // initialCartItems?: CartItem[];
   // initialLikedItems?: CartItem[];
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

   //데이터 정규화
   const normalizeItem = (item: any): CartItem => {
      return {
         id: Number(item.id),
         title: item.title ?? '',
         brand: item.brand ?? '',
         image: item.image,
         price: getSafeNumber(item.price),
         num: getSafeNumber(item.num ?? 1),
         discountAmount: getSafeNumber(item.discountAmount),
         isDiscounted: item.isDiscounted ?? getSafeNumber(item.discountAmount) > 0,
         checked: Boolean(item.checked ?? true),
         isUpdated: false,
      };
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
         const val = getSafeNumber(item.discountAmount ?? 0);
         const qty = getSafeNumber(item.num ?? 1);
         return acc + val * qty;
      }, 0);

      return {
         totalCostPrice: cost,
         totalDiscountAmount: discount,
         totalPrice: cost - discount,
      };
   }, [cartItems]);

   // 바로 구매 함수
   const buyNow = useCallback(async (newItem: any) => {
      const normItem = normalizeItem(newItem);
      const targetId = normItem.id;
      const addQty = normItem.num;
      setCartItems(prev => {
         const exists = prev.find(i => i.id === targetId);
         if (exists) {
            const newQty = getSafeNumber(exists.num) + addQty;
            updateCartItems([{ product_id: targetId, product_num: newQty }]);
            return prev.map(item => ({
               ...item,
               num: item.id === targetId ? newQty : item.num,
               checked: item.id === targetId,
            }));
         } else {
            const itemsToAdd = { ...normItem, checked: true };
            addCartItems([{ product_id: targetId, product_num: addQty }]).catch(console.error);
            return [itemsToAdd, ...prev.map(item => ({ ...item, checked: false }))];
         }
      });
   }, []);

   // 초기화 로직 (서버 데이터 로드)
   const init = useCallback(async () => {
      if (userLoading) return;

      setCartDataLoading(true);
      try {
         if (user) {
            const [initialCartItems, initialLikedItems] = await Promise.all([getCartItems(), getLikedItems()]);
            setCartItems(initialCartItems.map(normalizeItem));
            setLikedItems(initialLikedItems.map(normalizeItem));
         } else {
            setCartItems([]);
            setLikedItems([]);
         }
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
         const updatedCartItems = (await getCartItems()).map((item: any) => {
            const norm = normalizeItem(item);
            norm.checked = cartItemIds.has(norm.id) ? (cartItems.find(c => c.id === norm.id)?.checked ?? false) : false;
            return norm;
         });
         setCartItems(updatedCartItems);
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
      async (newItem: any) => {
         setDirectOrderItem(null); // 장바구니 이용 시 바로구매 상태 해제

         const normItem = normalizeItem(newItem);
         const targetId = normItem.id;
         const addQty = normItem.num;
         const existing = cartItems.find(item => item.id === targetId);

         if (existing) {
            const newQty = getSafeNumber(existing.num) + addQty;
            setCartItems(prev => prev.map(i => (i.id === targetId ? { ...i, num: newQty } : i)));
            await updateCartItems([{ product_id: targetId, product_num: newQty }]);
         } else {
            setCartItems(prev => [{ ...normItem, checked: true }, ...prev]);
            await addCartItems([{ product_id: targetId, product_num: addQty }]);
         }
      },
      [cartItems],
   );

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

   const isLiked = (itemId: number) => likedItems.some(item => item.id === itemId);
   const isItemCart = (itemId: number) => cartItems.some(item => item.id === itemId);

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
      const payload = newItems.map(item => ({ product_id: item.id, product_num: getSafeNumber(item.num) }));
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
      // paymentTotal,
      directOrderItem,
      buyNow,
      totalDiscountAmount,
      totalCostPrice,
      refreshCart,
      resetDirectOrder,
   };

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

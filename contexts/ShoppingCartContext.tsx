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
   toggleChecked: (id: string, type: 'cart' | 'like') => void; //number -> string
   toggleAllChecked: (type: 'cart' | 'like') => void;
   updateQuantity: (itemId: string, type: 'plus' | 'minus') => void; //number -> string
   updateAllQuantities: () => void;
   removeItem: (itemId: string) => void; //number -> string
   clear: (type: string) => void;
   toggleLike: (item: CartItem) => void;
   toggleCart: (item: CartItem) => void;
   addLikedItemsToCart: () => void;
   isLiked: (itemId: string) => boolean; //number -> string
   isItemCart: (itemId: string) => boolean; //number -> string
   addToCart: (itemId: CartItem) => Promise<void>;
   buyDirectly: (item: CartItem) => void; //추가
   paymentItems: CartItem[]; //추가
   paymentTotal: number; //추가
   resetDirectOrder: () => void; //추가
   buyNow: (item: CartItem) => void; // 👈 추가
   totalDiscountAmount: number;
   totalCostPrice: number;
}
interface CartItem {
   id: string;
   title: string;
   price: number | string;
   discount?: number | string;
   discountAmount?: number | string;
   discount_amount?: number | string; // DB 필드명
   quantity: number | string;
   num?: number | string;
   checked: boolean;
   [key: string]: any;
}
export const CartContext = createContext<CartContextDataType | undefined>(undefined);

export function useCart() {
   const context = useContext(CartContext);
   if (context === undefined) {
      throw new Error(
         'useCart must be used within a CartProvider\nCartProvider로 자식 컴포넌트(useCart사용하실 컴포넌트) 감싼 채로 사용하셔야 합니다.',
      );
   }
   return context;
}

interface CartProviderProps {
   children: ReactNode;
   initialCartItems: CartItem[];
   initialLikedItems: CartItem[];
}

export function CartProvider({ children }: CartProviderProps) {
   const [cartItems, setCartItems] = useState<CartItem[]>([]);
   const [likedItems, setLikedItems] = useState<CartItem[]>([]);
   const [cartDataLoading, setCartDataLoading] = useState(true);
   const [directOrderItem, setDirectOrderItem] = useState<CartItem | null>(null);
   const { user, loading: userLoading } = useUser();
   // 👇 [핵심] 안전한 숫자 변환 함수 (콤마 제거 및 NaN 방지)
   const getSafeNumber = (val: any) => {
      if (val === null || val === undefined) return 0;
      // 문자열인 경우 콤마 제거
      const str = String(val).replace(/,/g, '');
      const num = Number(str);
      return isNaN(num) ? 0 : num;
   };

   const { totalCostPrice, totalDiscountAmount, totalPrice } = useMemo(() => {
      const checkedItems = cartItems.filter(item => item.checked);

      const cost = checkedItems.reduce((acc, item) => {
         const price = Number(item.price) || 0;
         const qty = Number(item.quantity) || 1;
         return acc + price * qty;
      }, 0);

      const discount = checkedItems.reduce((acc, item) => {
         const val = Number(item.discount_amount ?? item.discountAmount ?? item.discount) || 0;
         const qty = Number(item.quantity) || 1;
         return acc + val * qty;
      }, 0);

      return {
         totalCostPrice: cost,
         totalDiscountAmount: discount,
         totalPrice: cost - discount,
      };
   }, [cartItems]);

   // 👇 [핵심 기능] 바로 구매 함수
   const buyNow = (newItem: CartItem) => {
      setCartItems(prev => {
         // 1. 기존 상품은 모두 체크 해제 (결제창에서 안 보이게)
         const uncheckedPrev = prev.map(item => ({ ...item, checked: false }));
         // 들어오는 데이터 정제 (숫자로 변환하여 저장)
         const cleanItem = {
            ...newItem,
            price: getSafeNumber(newItem.price),
            // Context는 주로 'num'을 쓰므로 'num'에도 값을 넣어줌
            num: getSafeNumber(newItem.quantity ?? newItem.num ?? 1),
            quantity: getSafeNumber(newItem.quantity ?? newItem.num ?? 1),
            checked: true,
         };
         // 2. 새 상품이 이미 있는지 확인
         const idx = uncheckedPrev.findIndex(item => item.id === newItem.id);

         let updatedItems;
         if (idx !== -1) {
            // 기존 아이템 업데이트
            uncheckedPrev[idx] = { ...uncheckedPrev[idx], ...cleanItem };
            updatedItems = [...uncheckedPrev];
         } else {
            // 새 아이템 추가
            updatedItems = [...uncheckedPrev, cleanItem];
         }

         localStorage.setItem('cartItems', JSON.stringify(updatedItems));
         return updatedItems;
      });
   };

   // // totalPrice 계산
   // const totalPrice = useMemo(
   //    () =>
   //       cartItems.reduce((sum, item) => {
   //          const price = Number(item.price) || 0;
   //          const discount = Number(item.discountAmount) || 0;
   //          const num = Number(item.num) || 1;
   //          // checked가 true인 것만 계산
   //          return sum + (item.checked ? (price - discount) * num : 0);
   //       }, 0),
   //    [cartItems],
   // );

   // likedItemIds
   const likedItemIds = useMemo(() => new Set(likedItems.map(item => item.id)), [likedItems]);
   const isLiked = (itemId: string) => likedItemIds.has(itemId);

   // cartItemIds
   const cartItemIds = useMemo(() => new Set(cartItems.map(item => item.id)), [cartItems]);
   const isItemCart = (itemId: string) => cartItemIds.has(itemId);

   const init = useCallback(async () => {
      if (userLoading) {
         return;
      }

      setCartDataLoading(true);

      let initialCartItems: CartItem[] = [];
      let initialLikedItems: CartItem[] = [];

      try {
         if (user) {
            [initialCartItems, initialLikedItems] = await Promise.all([getCartItems(), getLikedItems()]);

            const normalize = (item: any) => ({
               ...item,
               price: getSafeNumber(item.price),
               discountAmount: getSafeNumber(item.discountAmount ?? item.discount_amount ?? item.discount),
               num: getSafeNumber(item.num ?? 1),
               checked: Boolean(item.checked),
            });
            setCartItems(initialCartItems.map(normalize));
            setLikedItems(initialLikedItems.map(normalize));
         } else {
            setCartItems([]);
            setLikedItems([]);
         }
      } catch (error) {
         console.error('장바구니/좋아요 아이템 불러오기 실패:', error);
         setCartItems([]);
         setLikedItems([]);
      } finally {
         setCartDataLoading(false);
      }
   }, [user, userLoading]);

   useEffect(() => {
      init();
   }, [init]);
   const buyDirectly = useCallback((newItem: CartItem) => {
      setDirectOrderItem({ ...newItem, checked: true });
   }, []);

   const resetDirectOrder = useCallback(() => {
      setDirectOrderItem(null);
   }, []);

   const paymentItems = useMemo(() => {
      if (directOrderItem) return [directOrderItem];
      return cartItems.filter(item => item.checked);
   }, [directOrderItem, cartItems]);

   const paymentTotal = useMemo(() => {
      return paymentItems.reduce((sum, item) => {
         const price = getSafeNumber(item.price);
         const discount = getSafeNumber(item.discountAmount ?? item.discount_amount ?? item.discount);
         const num = getSafeNumber(item.num ?? item.quantity ?? 1); // num과 quantity 모두 체크

         return sum + (price - discount) * num;
      }, 0);
   }, [paymentItems]);

   const refreshCart = async () => {
      try {
         const updatedCartItems = (await getCartItems()).map(item =>
            cartItemIds.has(item.id) ? { ...item, checked: false } : item,
         );
         setCartItems(updatedCartItems);
      } catch (error) {
         console.error('[ShoppingCartContext] 장바구니 아이템을 다시 불러오는 과정에서 오류가 발생했습니다:', error);
      }
   };

   const toggleChecked = useCallback((id: string, type: 'cart' | 'like') => {
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

   // updateQuantity 함수
   const updateQuantity = useCallback(
      async (itemId: string, type: 'plus' | 'minus') => {
         setCartItems(prev =>
            prev.map(item => {
               if (item.id === itemId) {
                  const newNum = type === 'plus' ? item.num + 1 : Math.max(1, item.num - 1);
                  return { ...item, num: newNum };
               }
               return item;
            }),
         );

         // API 호출
         const item = cartItems.find(i => i.id === itemId);
         if (item) {
            const newNum = type === 'plus' ? item.num + 1 : Math.max(1, item.num - 1);
            await updateCartItems([{ product_id: itemId, product_num: newNum }]);
         }
      },
      [cartItems],
   );

   // updateAllQuantities 함수 구현
   const updateAllQuantities = useCallback(async () => {
      const payload = cartItems.map(item => ({
         product_id: item.id,
         product_num: item.num,
      }));
      await updateCartItems(payload);
   }, [cartItems]);

   // removeItem 함수 구현
   const removeItem = useCallback(async (itemId: string) => {
      const isSuccess = await deleteCartItem(itemId);
      if (isSuccess) {
         setCartItems(prev => prev.filter(item => item.id !== itemId));
      } else {
         console.log('delete Cart Item failed');
      }
   }, []);

   const clear = useCallback(async (type: string) => {
      switch (type) {
         case 'cart':
            await clearCart();
            break;
         case 'like':
            await clearLikedItem();
            break;
         default:
            console.warn(
               `ShoppingCartContext의 clear 함수에서 알 수 없는 type(${type})이 입력됐습니다.\n탭 메뉴의 value가 cart, like인지 확인하세요.`,
            );
            break;
      }
   }, []);

   const clearCart = async () => {
      const isSuccess = await deleteAllCartItems();
      isSuccess ? setCartItems([]) : console.log('delete All Cart Item failed');
   };

   const clearLikedItem = async () => {
      const isSuccess = await deleteAllLikedItem();
      isSuccess ? setLikedItems([]) : console.log('delete All Cart Item failed');
   };

   const toggleLike = useCallback(
      async (item: CartItem) => {
         if (isLiked(item.id)) {
            const isSuccess = await deleteLikedItem(item.id);
            isSuccess
               ? setLikedItems(prev => prev.filter(i => i.id !== item.id))
               : console.log('delete(unlike) Liked Item failed');
         } else {
            const isSuccess = await addLikedItem(item.id);
            isSuccess
               ? setLikedItems(prev => [{ ...item, checked: false }, ...prev])
               : console.log('add(like) Liked Item failed');
         }
      },
      [isLiked],
   );

   const toggleCart = useCallback(
      async (item: CartItem) => {
         if (isItemCart(item.id)) {
            const isSuccess = await deleteCartItem(item.id);
            if (isSuccess) {
               setCartItems(prev => prev.filter(i => i.id !== item.id));
            } else {
               console.error('장바구니 삭제 실패');
            }
         } else {
            const payload = [{ product_id: item.id, product_num: 1 }];
            const isSuccess = await addCartItems(payload);

            if (isSuccess) {
               setCartItems(prev => [{ ...item, checked: false, num: 1 }, ...prev]);
            } else {
               console.error('장바구니 추가 실패');
            }
         }
      },
      [isItemCart],
   );

   const addToCart = useCallback(
      async (newItem: CartItem) => {
         setDirectOrderItem(null);
         // 1. 이미 장바구니에 있는지 확인
         const existingItem = cartItems.find(item => item.id === newItem.id);

         if (existingItem) {
            const newQuantity = existingItem.num + (newItem.num || newItem.quantity || 1);
            setCartItems(prev => prev.map(item => (item.id === newItem.id ? { ...item, num: newQuantity } : item)));
            // API 호출
            await updateCartItems([{ product_id: newItem.id, product_num: newQuantity }]);
         } else {
            const initialNum = newItem.num || newItem.quantity || 1;
            // State 선반영
            setCartItems(prev => [{ ...newItem, num: initialNum, checked: true }, ...prev]);
            // API 호출
            await addCartItems([{ product_id: newItem.id, product_num: initialNum }]);
         }
      },
      [cartItems],
   );

   const addLikedItemsToCart = useCallback(async () => {
      const itemsToAdd = likedItems.filter(item => item.checked);
      const cartItemIds = new Set(cartItems.map(i => i.id));
      const newItems = itemsToAdd.filter(item => !cartItemIds.has(item.id));
      const payload = newItems.map(item => ({
         product_id: item.id,
         product_num: item.num,
      }));

      const isSuccess = await addCartItems(payload);

      if (!isSuccess) {
         console.log('delete Cart Item failed : ', payload);
         return;
      }

      setCartItems(prev => [...newItems.map(i => ({ ...i, checked: false })), ...prev]);
      setLikedItems(prev => prev.map(item => ({ ...item, checked: false })));
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
      addLikedItemsToCart,
      isLiked,
      isItemCart,
      toggleCart,
      totalPrice,
      addToCart,
      buyDirectly,
      paymentItems,
      paymentTotal,
      resetDirectOrder,
      buyNow, // 👈 내보내기
      totalDiscountAmount,
      totalCostPrice,
   };

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

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
}

const CartContext = createContext<CartContextDataType | undefined>(undefined);

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
   const { user, loading: userLoading } = useUser();

   // totalPrice 계산 (중복 제거)
   const totalPrice = useMemo(
      () =>
         cartItems.reduce((sum, item) => sum + (item.checked ? (item.price - item.discountAmount) * item.num : 0), 0),
      [cartItems],
   );

   // likedItemIds (중복 제거)
   const likedItemIds = useMemo(() => new Set(likedItems.map(item => item.id)), [likedItems]);
   const isLiked = (itemId: number) => likedItemIds.has(itemId);

   // cartItemIds (중복 제거)
   const cartItemIds = useMemo(() => new Set(cartItems.map(item => item.id)), [cartItems]);
   const isItemCart = (itemId: number) => cartItemIds.has(itemId);

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
            setCartItems(initialCartItems);
            setLikedItems(initialLikedItems);
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

   // updateQuantity 함수 수정 (잘못된 로직 수정)
   const updateQuantity = useCallback(
      async (itemId: number, type: 'plus' | 'minus') => {
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

   // updateAllQuantities 함수 구현 (누락되어 있었음)
   const updateAllQuantities = useCallback(async () => {
      const payload = cartItems.map(item => ({
         product_id: item.id,
         product_num: item.num,
      }));
      await updateCartItems(payload);
   }, [cartItems]);

   // removeItem 함수 구현 (누락되어 있었음)
   const removeItem = useCallback(async (itemId: number) => {
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
   };

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

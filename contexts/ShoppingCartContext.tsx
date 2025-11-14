"use client";

import { CartItem as ApiCartItem } from "@/app/api/cart/cart";
import { deleteCartItem } from "@/lib/minie/cartAPI";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";

// 'checked' 속성을 포함하는 내부적인 CartItem 타입을 정의
export interface CartItem extends ApiCartItem {
  checked: boolean;
}

// Context가 제공할 데이터와 함수의 타입을 정의
interface CartContextDataType {
  cartItems: CartItem[];
  likedItems: CartItem[];
  toggleChecked: (id: number, type: "cart" | "like") => void;
  toggleAllChecked: (type: "cart" | "like") => void;
  updateQuantity: (itemId: number, type: "plus" | "minus") => void;
  removeItem: (itemId: number) => void;
  clear: (type: string) => void;
  toggleLike: (item: CartItem) => void;
  addLikedItemsToCart: () => void;
  isLiked: (itemId: number) => boolean;
}

const CartContext = createContext<CartContextDataType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart must be used within a CartProvider\nCartProvider로 자식 컴포넌트(useCart사용하실 컴포넌트) 감싼 채로 사용하셔야 합니다."
    );
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
  initialCartItems: ApiCartItem[];
  initialLikedItems: ApiCartItem[];
}

export function CartProvider({
  children,
  initialCartItems,
  initialLikedItems,
}: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [likedItems, setLikedItems] = useState<CartItem[]>(initialLikedItems);

  const likedItemIds = useMemo(
    () => new Set(likedItems.map((item) => item.id)),
    [likedItems]
  );
  const isLiked = (itemId: number) => likedItemIds.has(itemId);

  const toggleChecked = useCallback((id: number, type: "cart" | "like") => {
    const setState = type === "cart" ? setCartItems : setLikedItems;
    setState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const toggleAllChecked = useCallback(
    (type: "cart" | "like") => {
      const [items, setState] =
        type === "cart"
          ? [cartItems, setCartItems]
          : [likedItems, setLikedItems];
      const isAllChecked =
        items.length > 0 && items.every((item) => item.checked);
      setState((prev) =>
        prev.map((item) => ({ ...item, checked: !isAllChecked }))
      );
    },
    [cartItems, likedItems]
  );

  const updateQuantity = useCallback(
    async (itemId: number, type: "plus" | "minus") => {
      switch (type) {
        case "plus":
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, num: item.num + 1 } : item
            )
          );
          break;
        case "minus":
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, num: item.num - 1 } : item
            )
          );
          break;
      }
    },
    [cartItems]
  );

  const removeItem = useCallback(async (itemId: number) => {
    const isSuccess = await deleteCartItem(itemId);

    isSuccess
      ? setCartItems((prev) => prev.filter((item) => item.id !== itemId))
      : console.log("delete Cart Item failed : ", itemId);
  }, []);

  const clear = useCallback(async (type: string) => {
    switch (type) {
      case "cart":
        setCartItems([]);
        break;

      case "like":
        setLikedItems([]);
        break;
      default:
        console.warn(
          `ShoppingCartContext의 clear 함수에서 알 수 없는 type(${type})이 입력됐습니다.\n탭 메뉴의 value가 cart, like인지 확인하세요.`
        );
        break;
    }
  }, []);

  const toggleLike = useCallback(
    (item: CartItem) => {
      if (isLiked(item.id)) {
        setLikedItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setLikedItems((prev) => [{ ...item, checked: false }, ...prev]);
      }
    },
    [likedItems]
  );

  const addLikedItemsToCart = useCallback(async () => {
    const itemsToAdd = likedItems.filter((item) => item.checked);
    const cartItemIds = new Set(cartItems.map((i) => i.id));
    const newItems = itemsToAdd.filter((item) => !cartItemIds.has(item.id));
    setCartItems((prev) => [
      ...newItems.map((i) => ({ ...i, checked: false })),
      ...prev,
    ]);
    setLikedItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  }, [likedItems, cartItems]);

  const value = {
    cartItems,
    likedItems,
    toggleChecked,
    toggleAllChecked,
    updateQuantity,
    removeItem,
    clear,
    toggleLike,
    addLikedItemsToCart,
    isLiked,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

"use client";

import { CartItem } from "@/app/api/cart/cart";
import {
  addCartItems,
  deleteAllCartItems,
  deleteCartItem,
  getCartItems,
  updateCartItems,
} from "@/lib/minie/cartAPI";
import {
  addLikedItem,
  deleteAllLikedItem,
  deleteLikedItem,
} from "@/lib/minie/likeAPI";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";

// Context가 제공할 데이터와 함수의 타입을 정의
interface CartContextDataType {
  cartItems: CartItem[];
  likedItems: CartItem[];
  totalPrice: number;
  totalDiscountAmount: number; //추가
  totalCostPrice: number; //추가 할인가격 미 적용 총 가격
  refreshCart: () => void; //추가 장바구니 상품 구매 이후 장바구니에서 해당 아이템들을 삭제 후 장바구니를 갱신하기 위함
  toggleChecked: (id: number, type: "cart" | "like") => void;
  toggleAllChecked: (type: "cart" | "like") => void;
  updateQuantity: (itemId: number, type: "plus" | "minus") => void;
  updateAllQuantities: () => void;
  removeItem: (itemId: number) => void;
  clear: (type: string) => void;
  toggleLike: (item: CartItem) => void;
  toggleCart: (item: CartItem) => void; //추가
  addLikedItemsToCart: () => void;
  isLiked: (itemId: number) => boolean;
  isItemCart: (itemId: number) => boolean; //추가
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
  initialCartItems: CartItem[];
  initialLikedItems: CartItem[];
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

  //장바구니 확인
  const cartItemIds = useMemo(
    () => new Set(cartItems.map((item) => item.id)),
    [cartItems]
  );
  const isItemCart = (itemId: number) => cartItemIds.has(itemId);

  //

  const totalCostPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0),
    [cartItems]
  );

  const totalDiscountAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.checked ? item.discountAmount : 0),
        0
      ),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.checked ? item.price - item.discountAmount : 0),
        0
      ),
    [cartItems]
  );

  const refreshCart = async () => {
    try {
      const updatedCartItems = (await getCartItems()).map((item) =>
        cartItemIds.has(item.id) ? { ...item, checked: false } : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("failed to update cartItem in useCart: ", error);
    }
  };

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
              item.id === itemId
                ? { ...item, num: item.num + 1, isUpdated: true }
                : item
            )
          );
          break;
        case "minus":
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId
                ? { ...item, num: item.num - 1, isUpdated: true }
                : item
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

  const updateAllQuantities = useCallback(async () => {
    const isUpdated = cartItems.filter((item) => item.isUpdated);

    console.log("isUpdated : ", isUpdated);

    const results = await updateCartItems(isUpdated);

    console.log("result : ", results);
  }, [cartItems]);

  const clear = useCallback(async (type: string) => {
    switch (type) {
      case "cart":
        clearCart();
        break;
      case "like":
        clearLikedItem();
        break;
      default:
        console.warn(
          `ShoppingCartContext의 clear 함수에서 알 수 없는 type(${type})이 입력됐습니다.\n탭 메뉴의 value가 cart, like인지 확인하세요.`
        );
        break;
    }
  }, []);

  const clearCart = async () => {
    const isSuccess = await deleteAllCartItems();
    isSuccess ? setCartItems([]) : console.log("delete All Cart Item failed");
  };

  const clearLikedItem = async () => {
    const isSuccess = await deleteAllLikedItem();
    isSuccess ? setLikedItems([]) : console.log("delete All Cart Item failed");
  };

  const toggleLike = useCallback(async (item: CartItem) => {
    if (isLiked(item.id)) {
      const isSuccess = await deleteLikedItem(item.id);
      isSuccess
        ? setLikedItems((prev) => prev.filter((i) => i.id !== item.id))
        : console.log("delete(unlike) Liked Item failed");
    } else {
      // 장바구니에 없으면 추가
      setCartItems((prev) => [
        { ...item, checked: false, num: item.num || 1 },
        ...prev,
      ]);
    }
  }, []);
  //

  const addLikedItemsToCart = useCallback(async () => {
    const itemsToAdd = likedItems.filter((item) => item.checked);
    const cartItemIds = new Set(cartItems.map((i) => i.id));
    const newItems = itemsToAdd.filter((item) => !cartItemIds.has(item.id));
    const payload = newItems.map((item) => ({
      product_id: item.id,
      product_num: item.num,
    }));

    const isSuccess = await addCartItems(payload);

    if (!isSuccess) {
      console.log("delete Cart Item failed : ", payload);
      return;
    }

    setCartItems((prev) => [...newItems, ...prev]);
  }, [likedItems]);

  //장바구니 토글
  const toggleCart = useCallback((item: CartItem) => {
    if (isItemCart(item.id)) {
      // 이미 장바구니에 있으면 제거
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      // 장바구니에 없으면 추가
      setCartItems((prev) => [
        { ...item, checked: false, num: item.num || 1 },
        ...prev,
      ]);
    }
  }, []);

  const value = {
    cartItems,
    likedItems,
    totalPrice,
    totalDiscountAmount,
    totalCostPrice,
    refreshCart,
    toggleChecked,
    toggleAllChecked,
    updateQuantity,
    updateAllQuantities,
    removeItem,
    clear,
    toggleLike,
    addLikedItemsToCart,
    isLiked,
    isItemCart, // 추가
    toggleCart, // 추가
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

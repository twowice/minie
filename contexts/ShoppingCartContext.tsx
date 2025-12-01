"use client";

import { CartItem } from "@/app/api/cart/cart";
import { useUser } from "@/context/UserContext";
import {
  addCartItem,
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
  getLikedItems,
} from "@/lib/minie/likeAPI";
import { isTypedCartItem } from "@/utils/typeChecker/isCartItem";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

// =================================================================================
// 1. 타입 정의 (Type Definitions)
// =================================================================================

interface CartContextDataType {
  cartItems: CartItem[];
  likedItems: CartItem[];
  totalPrice: number;
  totalDiscountAmount: number;
  totalCostPrice: number;
  isLoading: boolean;

  // 상태 확인
  isLiked: (itemId: number) => boolean;
  isItemCart: (itemId: number) => boolean;

  // 장바구니 액션
  addToCart: (item: any) => Promise<void>;
  buyNow: (item: any) => void;
  removeItem: (itemId: number) => void;
  clear: (type: string) => void;
  updateQuantity: (itemId: number, type: "plus" | "minus") => void;
  updateAllQuantities: () => void;
  refreshCart: () => Promise<void>;
  resetDirectOrder: () => void;

  // '좋아요' 액션
  toggleLike: (item: any) => void;

  // 체크박스 액션
  toggleChecked: (id: number, type: "cart" | "like") => void;
  toggleAllChecked: (type: "cart" | "like") => void;

  // 상호작용 액션
  toggleCart: (item: CartItem) => void;
  addLikedItemsToCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

// =================================================================================
// 2. Context 생성 및 커스텀 훅 (Context Creation & Custom Hook)
// =================================================================================

export const CartContext = createContext<CartContextDataType | undefined>(
  undefined
);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// =================================================================================
// 3. Provider 컴포넌트 (Provider Component)
// =================================================================================

export function CartProvider({ children }: CartProviderProps) {
  // -------------------------------------------------------------------------------
  // 3.1. 상태 관리 (State Management)
  // -------------------------------------------------------------------------------

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [likedItems, setLikedItems] = useState<CartItem[]>([]);
  const [directOrderItem, setDirectOrderItem] = useState<CartItem | null>(null);
  const [cartDataLoading, setCartDataLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  // -------------------------------------------------------------------------------
  // 3.2. 데이터 초기화 및 동기화 (Initialization & Sync)
  // -------------------------------------------------------------------------------

  const init = useCallback(async () => {
    if (userLoading) return;
    setCartDataLoading(true);
    try {
      if (user) {
        const [initialCartItems, initialLikedItems] = await Promise.all([
          getCartItems(),
          getLikedItems(),
        ]);
        setCartItems(initialCartItems);
        setLikedItems(initialLikedItems);
      } else {
        setCartItems([]);
        setLikedItems([]);
      }
    } catch (error) {
      console.error("초기화 실패:", error);
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
      const cartItemIds = new Set(cartItems.map((item) => item.id));
      const updatedCartItems = (await getCartItems()).map((item) =>
        cartItemIds.has(item.id) ? { ...item, checked: item.checked } : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Refresh Error:", error);
    }
  };

  // -------------------------------------------------------------------------------
  // 3.3. 데이터 정규화 및 헬퍼 (Data Normalization & Helpers)
  // -------------------------------------------------------------------------------

  const normalizeItem = (item: any): CartItem => {
    // console.log(item);
    // console.log(
    //   "[shoppingCartContext] normalizeItem item's isDiscounted:",
    //   item.is_discounted
    // );

    const norm = {
      id: Number(item.id),
      title: item.name || "",
      brand: item.brand || "",
      image:
        item.image ||
        "https://cdn.imweb.me/thumbnail/20220924/2f7f6930fd5c3.png",
      price: item.price || 0,
      num: item.num || 1,
      discountAmount: item.discount_amount,
      isDiscounted: item.discount_amount > 0, //shoppingdetail/[id] 페이지에서 넘어오는 정보에 isDiscounted 정보가 없어 대체
      checked: item.checked ?? true,
      isUpdated: false,
    };

    //console.log("[shoppingCartContext] normalizeItem", norm);

    return norm;
  };

  const isLiked = (itemId: number) =>
    likedItems.some((item) => item.id === itemId);

  const isItemCart = (itemId: number) =>
    cartItems.some((item) => item.id === itemId);

  // -------------------------------------------------------------------------------
  // 3.4. 메모이제이션된 계산 (Memoized Calculations)
  // -------------------------------------------------------------------------------

  const { totalCostPrice, totalDiscountAmount, totalPrice } = useMemo(() => {
    const checkedItems = cartItems.filter((item) => item.checked);
    const cost = checkedItems.reduce(
      (acc, item) => acc + item.price * (item.num ?? 1),
      0
    );
    const discount = checkedItems.reduce(
      (acc, item) => acc + (item.discountAmount ?? 0) * (item.num ?? 1),
      0
    );
    return {
      totalCostPrice: cost,
      totalDiscountAmount: discount,
      totalPrice: cost - discount,
    };
  }, [cartItems]);

  // -------------------------------------------------------------------------------
  // 3.5. 장바구니 핵심 기능 (Core Cart Actions)
  // -------------------------------------------------------------------------------

  const addToCart = useCallback(
    async (newItem: any) => {
      setDirectOrderItem(null); // 장바구니 이용 시 바로구매 상태 해제
      const normItem = normalizeItem(newItem);
      const targetId = normItem.id;
      const addQty = normItem.num;
      const existing = cartItems.find((item) => item.id === targetId);

      if (existing) {
        const newQty = existing.num + addQty;
        setCartItems((prev) =>
          prev.map((i) => (i.id === targetId ? { ...i, num: newQty } : i))
        );
        await updateCartItems([normItem]);
      } else {
        setCartItems((prev) => [{ ...normItem, checked: true }, ...prev]);
        try {
          await addCartItems([{ product_id: targetId, product_num: addQty }]);
        } catch (error) {
          console.log("장바구니 중복 에러 감지됨. 무시하고 진행합니다.");
        }
      }
    },
    [cartItems]
  );

  const buyNow = useCallback(
    async (newItem: any) => {
      const normItem = normalizeItem(newItem);
      const targetId = normItem.id;
      const addQty = normItem.num;

      const exists = cartItems.find((i) => i.id === targetId);

      if (exists) {
        const newQty = addQty;

        updateCartItems([normItem]).catch((err) =>
          console.error("Update failed:", err)
        );

        setCartItems((prev) =>
          prev.map((item) => ({
            ...item,
            num: item.id === targetId ? newQty : item.num,
            checked: item.id === targetId, // 이 상품만 체크 true
          }))
        );
      } else {
        setCartItems((prev) => [
          { ...normItem, checked: true },
          ...prev.map((item) => ({ ...item, checked: false })), // 나머지는 체크 해제
        ]);

        try {
          await addCartItem({ product_id: targetId, product_num: addQty });
        } catch (error) {
          console.log("바로구매 중복 에러(이미 서버에 존재함). 무시하고 진행.");
        }
      }
    },
    [cartItems]
  );

  const resetDirectOrder = useCallback(() => {
    setDirectOrderItem(null);
    localStorage.removeItem("buyNowItem");
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    const isSuccess = await deleteCartItem(itemId);
    if (isSuccess) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  }, []);

  const updateQuantity = useCallback(
    async (itemId: number, type: "plus" | "minus") => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                num: type === "plus" ? item.num + 1 : Math.max(1, item.num - 1),
              }
            : item
        )
      );
    },
    []
  );

  const updateAllQuantities = useCallback(async () => {
    const payload = cartItems.filter((item) => item.isUpdated);
    await updateCartItems(payload);
  }, [cartItems]);

  const clear = useCallback(async (type: string) => {
    if (type === "cart") {
      await deleteAllCartItems().then((res) => res && setCartItems([]));
    }
    if (type === "like") {
      await deleteAllLikedItem().then((res) => res && setLikedItems([]));
    }
  }, []);

  // -------------------------------------------------------------------------------
  // 3.6. '좋아요' 기능 (Like Actions)
  // -------------------------------------------------------------------------------

  const toggleLikeFromCart = useCallback(
    async (item: CartItem) => {
      if (isLiked(item.id)) {
        await deleteLikedItem(item.id).then(
          (res) =>
            res && setLikedItems((prev) => prev.filter((i) => i.id !== item.id))
        );
      } else {
        await addLikedItem(item.id).then(
          (res) =>
            res &&
            setLikedItems((prev) => [{ ...item, checked: false }, ...prev])
        );
      }
    },
    [isLiked]
  );

  const toggleLikeFromProduct = (item: any) => {
    const normData = normalizeItem(item);
    toggleLikeFromCart(normData);
  };

  const toggleLike = (item: any) => {
    isTypedCartItem(item)
      ? toggleLikeFromCart(item)
      : toggleLikeFromProduct(item);
  };

  // -------------------------------------------------------------------------------
  // 3.7. 체크박스 상태 관리 (Checkbox State Management)
  // -------------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------------
  // 3.8. 장바구니와 '좋아요' 상호작용 (Cart & Like Interactions)
  // -------------------------------------------------------------------------------

  const toggleCart = useCallback(
    async (item: CartItem) => {
      if (isItemCart(item.id)) {
        await deleteCartItem(item.id).then(
          (res) =>
            res && setCartItems((prev) => prev.filter((i) => i.id !== item.id))
        );
      } else {
        await addCartItems([{ product_id: item.id, product_num: 1 }]).then(
          (res) =>
            res &&
            setCartItems((prev) => [
              { ...normalizeItem(item), checked: false, num: 1 },
              ...prev,
            ])
        );
      }
    },
    [isItemCart]
  );

  const addLikedItemsToCart = useCallback(async () => {
    const itemsToAdd = likedItems.filter((item) => item.checked);
    const existingIds = new Set(cartItems.map((i) => i.id));
    const newItems = itemsToAdd.filter((item) => !existingIds.has(item.id));
    const payload = newItems.map((item) => ({
      product_id: item.id,
      product_num: item.num,
    }));
    const isSuccess = await addCartItems(payload);
    if (isSuccess) {
      setCartItems((prev) => [
        ...newItems.map((i) => ({ ...i, checked: false })),
        ...prev,
      ]);
      setLikedItems((prev) =>
        prev.map((item) => ({ ...item, checked: false }))
      );
    }
  }, [likedItems, cartItems]);

  // -------------------------------------------------------------------------------
  // 3.9. Context 값 제공 (Context Value Provider)
  // -------------------------------------------------------------------------------

  const value = {
    cartItems,
    likedItems,
    totalPrice,
    totalDiscountAmount,
    totalCostPrice,
    isLoading: cartDataLoading,
    isLiked,
    isItemCart,
    addToCart,
    buyNow,
    removeItem,
    clear,
    updateQuantity,
    updateAllQuantities,
    refreshCart,
    resetDirectOrder,
    toggleLike,
    toggleChecked,
    toggleAllChecked,
    toggleCart,
    addLikedItemsToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

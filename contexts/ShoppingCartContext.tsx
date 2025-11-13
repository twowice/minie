'use client'

import { CartItem } from "@/app/api/cart/cart";
import { useContext, createContext, ReactNode, useState, useCallback } from "react";

interface CartContextDataType {
    cartItems: CartItem[]
    setCartItems: (items: CartItem[]) => void
}

const CartContext = createContext<CartContextDataType|undefined>(undefined)

export function useCart(){
    const context = useContext(CartContext)
    if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


interface CartProviderProps {
  children: ReactNode;
  initialCartItems: CartItem[]
}

export function CartProvider({ children, initialCartItems }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const value = {
    cartItems,
    setCartItems: setCartItems,
  };

   return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

"use client";
import {
  Drawer,
  Portal,
  Button,
  CloseButton,
  IconButton,
  Icon,
  createIcon,
} from "@chakra-ui/react";
import { useState } from "react";

const CartIcon = createIcon({
  displayName: "CartIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      fill="none"
      stroke="currentColor"
    />
  ),
});

export default function ShoppingCartDrawer() {
  const [isCartActivity, setIsCartActivity] = useState(false);

  return (
    <IconButton
      aria-label="장바구니"
      onClick={() => {
        setIsCartActivity((prev) => !prev);
      }}
      cursor="pointer"
    >
      <CartIcon
        w={{ base: 5, md: 6 }}
        h={{ base: 5, md: 6 }}
        color={isCartActivity ? "#FA6D6D" : "black"}
      />
    </IconButton>
  );
}

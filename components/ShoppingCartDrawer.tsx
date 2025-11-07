"use client";
import { Drawer, Portal, Button, CloseButton } from "@chakra-ui/react";
import { useState } from "react";
import { Provider } from "./ui/provider";

export default function ShoppingCartDrawer() {
  const [isCartActivity, setIsCartActivity] = useState(false);

  return (
    <button
      className="hover:opacity-70 cursor-pointer"
      aria-label="장바구니"
      onClick={() => {
        setIsCartActivity((prev) => !prev);
      }}
    >
      <svg
        className={`w-5 h-5 md:w-6 md:h-6 ${
          isCartActivity ? "text-[#FA6D6D]" : "text-black"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </button>
  );
}

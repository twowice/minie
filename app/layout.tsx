// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Croissant_One } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { Box } from "@chakra-ui/react";
import { CartProvider } from "@/contexts/ShoppingCartContext";
import { CartItem } from "./api/cart/cart";
import { getCartItems } from "@/lib/minie/cartAPI";
import { getLikedItems } from "@/lib/minie/likeAPI";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Minié",
  description: "Minié 쇼핑몰",
};

const croissantOne = Croissant_One({
  weight: "400",
  style: "normal",
  variable: "--font-croissant-one",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialCartItems: CartItem[] = [];
  let initialLikedItems: CartItem[] = [];

  try {
    [initialCartItems, initialLikedItems] = await Promise.all([
      getCartItems(),
      getLikedItems(),
    ]);
  } catch (error) {
    console.error("Error during parallel data fetch:", error);
    initialCartItems = [];
    initialLikedItems = [];
  }

  return (
    <html lang="ko">
      <body className={croissantOne.className}>
        <Provider>
          <Toaster />
          <CartProvider
            initialCartItems={initialCartItems}
            initialLikedItems={initialLikedItems}
          >
            <Box
              display="flex"
              flexDirection="column"
              minH="100vh"
              bg="white"
              fontSmooth="antialiased"
            >
              <Header />
              <Box as="main" display="flex" flexDirection="column" flex="1">
                {children}
              </Box>
              <Footer />
            </Box>
          </CartProvider>
        </Provider>
      </body>
    </html>
  );
}

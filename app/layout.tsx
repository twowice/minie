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
  /* 장바구니 정보 불러오기 */
  let initCartItems: CartItem[] = [];
  try {
    const shoppingCartResponse = await fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!shoppingCartResponse.ok) {
      const errorData = await shoppingCartResponse.json();
      console.error(
        "Failed to fetch cart items:",
        shoppingCartResponse.status,
        errorData
      );
    } else {
      initCartItems = (await shoppingCartResponse.json()) as CartItem[];
    }
  } catch (error) {
    console.error("Error during cart items fetch:", error);
  }

  return (
    <html lang="ko">
      <body className={croissantOne.className}>
        <Provider>
          <CartProvider initialCartItems={initCartItems}>
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

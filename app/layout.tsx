// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Croissant_One } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { CartProvider } from "@/contexts/ShoppingCartContext";
import { Toaster } from "@/components/ui/toaster";
// 2025-11-19 session 관리를 위해 추가 (박영준)
import { UserProvider } from "@/context/UserContext";
import LayoutController from "@/components/LayoutController";

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
  return (
    <html lang="ko">
      <body className={croissantOne.className}>
        <Provider>
          <Toaster />
          <UserProvider>
            <CartProvider>
              {" "}
              {/* 2025-11-19 ession 관리를 위해 수정 (박영준) */}
              <LayoutController>{children}</LayoutController>
            </CartProvider>
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}

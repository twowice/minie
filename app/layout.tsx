// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Croissant_One } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Minié",
  description: "Minié 쇼핑몰",
};

const croissantOne = Croissant_One({
  weight: "400",
  style: "normal",
  variable: "--font-croissant-one",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={croissantOne.className}>
        <Provider>
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
        </Provider>
      </body>
    </html>
  );
}

// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Croissant_One } from "next/font/google";

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
      <body
        className={`${croissantOne.className}bg-white antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex flex-col flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

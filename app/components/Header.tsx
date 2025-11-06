"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar - 모바일에서 숨김 */}
        <div className="hidden md:flex justify-end items-center py-2 text-xs lg:text-sm text-gray-600 ">
          <Link href="/login" className="px-2 lg:px-3 hover:text-black">
            로그인
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/orders" className="px-2 lg:px-3 hover:text-black">
            주문조회
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/mypage" className="px-2 lg:px-3 hover:text-black">
            마이페이지
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/support" className="px-2 lg:px-3 hover:text-black">
            고객센터
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/reviews" className="px-2 lg:px-3 hover:text-black">
            리뷰
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/payment" className="px-2 lg:px-3 hover:text-black">
            결제
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/inquiry" className="px-2 lg:px-3 hover:text-black">
            1:1문의
          </Link>
        </div>
        {/* Main header */}
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-black cursor-pointer font-croissant"
                style={{ fontFamily: "CroissantOne, cursive", fontWeight: "lighter"}}>
              Minié
            </h1>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-14 xl:gap-14 text-sm xl:text-base text-black">
            <Link href="/shopping" className={`${pathname === "/shopping" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              스킨케어
            </Link>
            <Link href="/cleansing" className={`${pathname === "/cleansing" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              클렌징
            </Link>
            <Link href="/suncare" className={`${pathname === "/suncare" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              선케어
            </Link>
            <Link href="/makeup" className={`${pathname === "/makeup" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              메이크업
            </Link>
            <Link href="/beauty" className={`${pathname === "/beauty" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              뷰티소품
            </Link>
            <Link href="/bodycare" className={`${pathname === "/bodycare" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              바디케어
            </Link>
            <Link href="/haircare" className={`${pathname === "/haircare" ? "text-[#FA6D6D] font-semibold" : "hover:text-gray-600"}`}>
              헤어케어
            </Link>
          </nav>
          {/* Icons */}
          <div className="flex gap-3 md:gap-4 text-black">
            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:opacity-70 cursor-pointer"
              aria-label="메뉴"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* 마이페이지 아이콘 */}
            {}
            {/* <button
              onClick={() => router.push("/mypage")}
              className="hover:opacity-70 cursor-pointer"
              aria-label="마이페이지"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button> */}
            {/* 장바구니 아이콘 */}
            <button
              className="hover:opacity-70 cursor-pointer"
              aria-label="장바구니"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
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
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col gap-3 text-base text-black">
              <Link href="/shopping" className="hover:text-gray-600 py-2">
                쇼핑케어
              </Link>
              <Link href="/cleansing" className="hover:text-gray-600 py-2">
                클렌징
              </Link>
              <Link href="/suncare" className="hover:text-gray-600 py-2">
                선케어
              </Link>
              <Link href="/makeup" className="hover:text-gray-600 py-2">
                메이크업
              </Link>
              <Link href="/beauty" className="hover:text-gray-600 py-2">
                뷰티소품
              </Link>
              <Link href="/bodycare" className="hover:text-gray-600 py-2">
                바디케어
              </Link>
              <Link href="/haircare" className="hover:text-gray-600 py-2">
                헤어케어
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/login" className="hover:text-black">
                로그인
              </Link>
              <Link href="/orders" className="hover:text-black">
                주문조회
              </Link>
              <Link href="/support" className="hover:text-black">
                고객센터
              </Link>
              <Link href="/reviews" className="hover:text-black">
                리뷰
              </Link>
              <Link href="/payment" className="hover:text-black">
                결제
              </Link>
              <Link href="/inquiry" className="hover:text-black">
                1:1문의
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

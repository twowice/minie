// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    '/images/main/mainBg1.jpg',
    '/images/main/mainBg2.jpg',
    '/images/main/mainBg3.jpg',
    '/images/main/mainBg4.jpg',
    '/images/main/mainBg5.jpg',
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex justify-end items-center py-2 text-sm text-gray-600 border-b">
            <Link href="/login" className="px-3 hover:text-black">로그인</Link>
            <span className="text-gray-300">|</span>
            <Link href="/orders" className="px-3 hover:text-black">주문조회</Link>
            <span className="text-gray-300">|</span>
            <Link href="/support" className="px-3 hover:text-black">고객센터</Link>
            <span className="text-gray-300">|</span>
            <Link href="/reviews" className="px-3 hover:text-black">리뷰</Link>
            <span className="text-gray-300">|</span>
            <Link href="/payment" className="px-3 hover:text-black">결제</Link>
            <span className="text-gray-300">|</span>
            <Link href="/inquiry" className="px-3 hover:text-black">1:1문의</Link>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black cursor-pointer">Minié</h1>
            </Link>
            
            {/* Navigation */}
            <nav className="flex gap-8 text-base text-black">
              <Link href="/shopping" className="hover:text-gray-600">쇼핑케어</Link>
              <Link href="/cleansing" className="hover:text-gray-600">클렌징</Link>
              <Link href="/suncare" className="hover:text-gray-600">선케어</Link>
              <Link href="/makeup" className="hover:text-gray-600">메이크업</Link>
              <Link href="/beauty" className="hover:text-gray-600">뷰티소품</Link>
              <Link href="/bodycare" className="hover:text-gray-600">바디케어</Link>
              <Link href="/haircare" className="hover:text-gray-600">헤어케어</Link>
            </nav>

            {/* Icons */}
            <div className="flex gap-4 text-black">
              {/* 마이페이지 아이콘 */}
              <button 
                onClick={() => router.push('/mypage')}
                className="hover:opacity-70 cursor-pointer"
                aria-label="마이페이지"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* 장바구니 아이콘 */}
              <button 
                onClick={() => router.push('/cart')}
                className="hover:opacity-70 cursor-pointer"
                aria-label="장바구니"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Carousel */}
      <section className="relative max-w-7xl mx-auto px-4 h-[650px] flex items-center overflow-hidden">
        <div 
          className="relative w-full h-full bg-cover bg-center bg-no-repeat bg-gray-200"
          style={{ backgroundImage: `url(${slides[currentSlide]})` }}
        >
          {/* Navigation arrows */}
          {/* 이전 버튼 */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 text-black transition-all duration-200"
            aria-label="이전 슬라이드"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-xl hover:bg-gray-100 text-black transition-all duration-200"
            aria-label="다음 슬라이드"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-black">
          <span className="font-semibold">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="text-gray-600"> / {String(totalSlides).padStart(2, '0')}</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Left side */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">Minié</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>대표이사 : 이선영 | 사업자등록번호 : 000-00-00000</p>
                <p>주소: (04320) 서울특별시 용산구 원효대로 372, 24층 (용산동, KDB타워)</p>
                <p>호스팅사업자 : Minié</p>
                <p>통신판매업신고번호 : 2019-서울용산-1428</p>
                <p>이메일 : <a href="mailto:Mini@web@Mini@.net" className="hover:text-black">Mini@web@Mini@.net</a></p>
              </div>
            </div>

            {/* Right side */}
            <div className="text-right">
              <p className="text-sm mb-2 text-black">고객센터</p>
              <p className="text-2xl font-bold mb-2 text-black">1577-1577</p>
              <p className="text-sm text-gray-600">09:00~18:00 평-금</p>
              <p className="text-sm text-gray-600">휴무 토-일</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            Copyright © Minié. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
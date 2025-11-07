"use client";
import { useCallback, useEffect, useState } from "react";

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/images/main/mainBg1.jpg",
    "/images/main/mainBg2.jpg",
    "/images/main/mainBg3.jpg",
    "/images/main/mainBg4.jpg",
    "/images/main/mainBg5.jpg",
  ];
  const totalSlides = slides.length;

  // 다음 슬라이드
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    console.log("Total Slides:", totalSlides);
  }, [totalSlides]);

  // 이전 슬라이드
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);
  return (
    <section className="relative w-full h-[calc(100vh-251px)]">
      {/* ^^^^^ 메인 캐러셀 섹션 ^^^^^
        height: 화면 높이에서 헤더와 푸터 높이(101+145px) + padding 값(16+16px)=278px를 뺀 값
     */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 배경 이미지들 */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* 이전 버튼 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl transition-all duration-200 z-20"
          aria-label="이전 슬라이드"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl transition-all duration-200 z-20"
          aria-label="다음 슬라이드"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/90 px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg z-20">
          <span className="text-xs sm:text-sm font-semibold text-black">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm text-gray-600">
            {" "}
            / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

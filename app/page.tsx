"use client";

import HomeCarousel from "./components/HomeCarousel";

export default function Home() {
  return (
    <div className="bg-white h-screen flex flex-col ">
      {/* Main Carousel - 완전히 새로 작성 */}
      <HomeCarousel />
    </div>
  );
}

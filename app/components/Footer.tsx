export default function Footer() {
  return (
    <footer className="border-t py-4 md:py-6 bg-gray-50 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left side */}
          <div>
            <h1
              className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-black"
              style={{ fontFamily: "CroissantOne, cursive" }}
            >
              Minié
            </h1>
            <div className="text-xs md:text-sm text-gray-600 space-y-1">
              <p>대표이사 : 이선영 | 사업자등록번호 : 000-00-00000</p>
              <p className="break-all">
                주소: (04320) 서울특별시 용산구 원효대로 372, 24층 (용산동,
                KDB타워)
              </p>
              <p>호스팅사업자 : Minié</p>
              <p>통신판매업신고번호 : 2019-서울용산-1428</p>
              <p className="break-all">
                이메일 :{" "}
                <a
                  href="mailto:Mini@web@Mini@.net"
                  className="hover:text-black"
                >
                  Mini@web@Mini@.net
                </a>
              </p>
            </div>
          </div>
          {/* Right side */}
          <div className="md:text-right">
            <p className="text-xs md:text-sm mb-1 md:mb-2 text-black">
              고객센터
            </p>
            <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-black">
              1577-1577
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              09:00~18:00 평-금
            </p>
            <p className="text-xs md:text-sm text-gray-600">휴무 토-일</p>
          </div>
        </div>
        <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t text-center text-xs md:text-sm text-gray-500">
          Copyright © Minié. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

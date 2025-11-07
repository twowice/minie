export default function Footer() {
   return (
      <footer className="py-2 bg-[#cccccc]/16">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex mb-2">
               {/* Left side */}
               <h1
                  className="text-3xl font-bold text-blackcursor-pointer font-croissant w-50 flex justify-center items-center mr-[90px]"
                  style={{ fontFamily: 'CroissantOne, cursive' }}
               >
                  Minié
               </h1>
               {/* Right side */}
               <div className="flex justify-between  grow">
                  <div>
                     <h1
                        className="text-xs font-bold mb-2 text-[#000000]/64"
                        style={{ fontFamily: 'CroissantOne, cursive', fontWeight: 'lighter' }}
                     >
                        Minié
                     </h1>
                     <div className="text-xs text-[#000000]/64">
                        <div>대표이사 : 이선영 | 사업자등록번호 : 000-00-00000</div>
                        <div className="break-all">
                           주소: (04320) 서울특별시 용산구 원효대로 372, 24층 (용산동, KDB타워)
                        </div>
                        <div>호스팅사업자 : Minié</div>
                        <div>통신판매업신고번호 : 2019-서울용산-1428</div>
                        <div className="break-all">
                           이메일 :{' '}
                           <a href="mailto:Miniéweb@Minie@.net" className="hover:text-black">
                              Miniéweb@Minie@.net
                           </a>
                        </div>
                     </div>
                  </div>
                  <div className="md:text-right text-[#000000]/64">
                     <div className="flex justify-end items-center gap-2 mb-2">
                        <div className="text-base font-bold">고객센터</div>
                        <div className="text-base font-bold ">1577-1577</div>
                     </div>
                     <div className="text-xs ">09:00~18:00 월-금</div>
                     <div className="text-xs ">휴무 토-일</div>
                  </div>
               </div>
            </div>
            <div className="py-2 border-t border-[#000000]/16 text-center text-xs text-[#000000]/50">
               Copyright © Minié. All Rights Reserved.
            </div>
         </div>
      </footer>
   );
}


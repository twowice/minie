'use client';

import FilterBar from '@/components/FilterBar';
import ShoppingItem from '@/components/ShoppingItem';
import { ButtonGroup, Container, IconButton, Pagination, SimpleGrid } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useEffect, useState } from 'react';

export default function Beauty() {
   const [filterItem, setFilterItem] = useState([]);
   const [item, setItem] = useState([]);

   const [currentCategory, setCurrentCategory] = useState('뷰티소품');

   const [isLoading, setIsLoading] = useState(true); // 실제 데이터 로딩 상태
   const [showSkeleton, setShowSkeleton] = useState(true); // 화면에 보여줄 스켈레톤 상태

   const [error, setError] = useState(null);
   const [page, setPage] = useState(1);
   const pageSize = 8; // 한 페이지당 보여줄 개수 (원하는 대로 조절)

   useEffect(() => {
      let timer: NodeJS.Timeout;

      if (!isLoading) {
         // 데이터 로딩이 끝났더라도, 0.5초(500ms) 뒤에 스켈레톤을 끕니다.
         // 이 시간 동안 브라우저는 데이터를 미리 준비할 시간을 법니다.
         timer = setTimeout(() => {
            setShowSkeleton(false);
         }, 500);
      }

      return () => clearTimeout(timer);
   }, [isLoading]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            setIsLoading(true);
            setShowSkeleton(true);
            const response = await fetch('api/products');
            if (!response.ok) {
               throw new Error('데이터를 불러오는 데 실패했습니다.');
            }
            const data = await response.json();

            setItem(data.products || []);
            setFilterItem(data.products || []);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProducts();
   }, []);

   const offset = (page - 1) * pageSize;
   const currentItems = filterItem.slice(offset, offset + pageSize);

   if (error) return <div>데이터 로딩 실패</div>;

   // [삭제됨] if (isLoading) return <div>로딩중...</div>;
   // -> 이제 아래 return 문에서 처리합니다.

   return (
      <Container maxW={'7xl'} maxH={'100%'}>
         {/* 로딩 중에도 필터바는 보이게 유지 */}
         <FilterBar category={currentCategory} onDataFiltered={setFilterItem} list={item} />

         <SimpleGrid m={'0 auto'} minChildWidth={'250px'} gap={'8px'} minH={'500px'}>
            {showSkeleton
               ? // 로딩 중일 때는 스켈레톤 (개수도 pageSize에 맞춤)
                 Array.from({ length: pageSize }).map((_, index) => <ShoppingItem key={index} isLoading={true} />)
               : // 3. 전체 filterItem이 아니라 잘라낸 currentItems만 렌더링
                 currentItems.map((product: any) => <ShoppingItem key={product.id} item={product} />)}
         </SimpleGrid>

         {/* pagination */}
         {/* 로딩이 아닐 때만 페이지네이션을 보여주거나, 로딩 중엔 숨기는 것이 자연스럽습니다 */}
         {!showSkeleton && (
            <Pagination.Root
               count={filterItem.length} // 전체 개수
               pageSize={pageSize}
               defaultPage={1}
               page={page} // 현재 페이지 연결
               onPageChange={e => setPage(e.page)} // 페이지 변경 시 상태 업데이트
               m={'0 auto'}
               w={'100%'}
               textAlign={'center'}
               p={'4'}
            >
               <ButtonGroup variant="ghost" size="sm">
                  <Pagination.PrevTrigger asChild color={'black'}>
                     <IconButton _hover={{ color: 'white' }}>
                        <LuChevronLeft />
                     </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.Items
                     color="black"
                     render={page => (
                        <IconButton variant={{ base: 'ghost', _selected: 'outline' }} _hover={{ color: 'white' }}>
                           {page.value}
                        </IconButton>
                     )}
                  />
                  <Pagination.NextTrigger asChild color={'black'}>
                     <IconButton _hover={{ color: 'white' }}>
                        <LuChevronRight />
                     </IconButton>
                  </Pagination.NextTrigger>
               </ButtonGroup>
            </Pagination.Root>
         )}
      </Container>
   );
}

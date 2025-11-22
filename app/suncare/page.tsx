'use client';

import FilterBar from '@/components/FilterBar';
import ShoppingItem from '@/components/ShoppingItem';
import { Box, ButtonGroup, Container, IconButton, Pagination, SimpleGrid } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useEffect, useState } from 'react';

export default function Suncare() {
   const [filterItem, setFilterItem] = useState([]);
   const [item, setItem] = useState([]);

   const [currentCategory, setCurrentCategory] = useState('선케어');

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

   const emptyCount = !showSkeleton ? pageSize - currentItems.length : 0;
   const dummyItem = filterItem.length > 0 ? filterItem[0] : null;

   if (error) return <div>데이터 로딩 실패</div>;

   return (
      <Container maxW={'7xl'} maxH={'100%'}>
         <FilterBar category={currentCategory} onDataFiltered={setFilterItem} list={item} />

         <SimpleGrid m={'0 auto'} minChildWidth={'250px'} gap={'8px'} minH={'500px'}>
            {showSkeleton ? (
               Array.from({ length: pageSize }).map((_, index) => <ShoppingItem key={index} isLoading={true} />)
            ) : (
               <>
                  {currentItems.map((product: any) => (
                     <ShoppingItem key={product.id} item={product} />
                  ))}

                  {emptyCount > 0 &&
                     dummyItem &&
                     Array.from({ length: emptyCount }).map((_, index) => (
                        <Box key={`empty-${index}`} visibility="hidden" pointerEvents="none" aria-hidden="true">
                           <ShoppingItem item={dummyItem} />
                        </Box>
                     ))}
               </>
            )}
         </SimpleGrid>

         {/* pagination */}
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

'use client';

import FilterBar from '@/components/FilterBar';
import ShoppingItem from '@/components/ShoppingItem';
import { AspectRatio, Box, Container, SimpleGrid, Text } from '@chakra-ui/react';
// import items from '@/data/items.json'; //더미데이터
import { useEffect, useState } from 'react';
import PlainPagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 8;
export default function Haircare() {
   const [filterItem, setFilterItem] = useState([]);
   const [item, setItem] = useState([]);

   const [currentCategory, setCurrentCategory] = useState('헤어케어');

   const [currentPage, setCurrentPage] = useState(1);

   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await fetch('api/products');
            if (!response.ok) {
               throw new Error('데이터를 불러오는 데 실패했습니다.');
            }
            const data = await response.json();

            const productList = data.products || [];
            setItem(productList);
            setFilterItem(productList);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      };
      fetchProducts();
   }, []);

   useEffect(() => {
      setCurrentPage(1);
   }, [filterItem]);

   const totalPages = Math.ceil(filterItem.length / ITEMS_PER_PAGE);

   const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
   const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
   const currentItem = filterItem.slice(indexOfFirstItem, indexOfLastItem);

   const emptySlots = Array.from({ length: ITEMS_PER_PAGE - currentItem.length });

   const handlePageChange = (pages: any) => {
      setCurrentPage(pages);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   if (error) return <div>데이터 로딩 실패</div>;
   if (isLoading) return <div>로딩중...</div>;

   return (
      <Container maxW={'7xl'} maxH={'100%'}>
         <FilterBar category={currentCategory} onDataFiltered={setFilterItem} list={item} />
         <SimpleGrid m={'0 auto'} minChildWidth={'250px'} gap={'8px'} minH={'500px'} mt={4}>
            {currentItem.length > 0 ? (
               currentItem.map((product: any) => (
                  <Box key={product.id} h={'100%'}>
                     <ShoppingItem item={product} />
                  </Box>
               ))
            ) : (
               <Box w={'100%'} textAlign={'center'} py={20}>
                  <Text>해당하는 상품이 없습니다.</Text>
               </Box>
            )}

            {currentItem.length > 0 &&
               emptySlots.map((_, index) => (
                  <Box key={`empty-${index}`} h={'100%'} aria-hidden="true">
                     <AspectRatio ratio={1} w={'100%'} opacity={0}>
                        <Box bg="transparent" />
                     </AspectRatio>
                     <Box h="120px" />
                  </Box>
               ))}
         </SimpleGrid>

         {filterItem.length > 0 && (
            <PlainPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         )}
      </Container>
   );
}

'use client';

import FilterBar from '@/components/FilterBar';
import ShoppingItem from '@/components/ShoppingItem';
import { ButtonGroup, Container, IconButton, Pagination, SimpleGrid } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
// import items from '@/data/items.json'; //더미데이터
import { useEffect, useState } from 'react';

export default function Makeup() {
   const [filterItem, setFilterItem] = useState([]);
   const [item, setItem] = useState([]);

   const [currentCategory, setCurrentCategory] = useState('메이크업');

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

   if (error) return <div>데이터 로딩 실패</div>;
   if (isLoading) return <div>로딩중...</div>;

   return (
      <Container maxW={'7xl'} maxH={'100%'}>
         <FilterBar category={currentCategory} onDataFiltered={setFilterItem} list={item} />
         <SimpleGrid m={'0 auto'} minChildWidth={'250px'} gap={'8px'} minH={'500px'}>
            {filterItem.map((product: any) => (
               <ShoppingItem key={product.id} item={product} />
            ))}
         </SimpleGrid>

         {/* pagination */}
         <Pagination.Root count={20} pageSize={2} defaultPage={1} m={'0 auto'} w={'100%'} textAlign={'center'} p={'4'}>
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
      </Container>
   );
}

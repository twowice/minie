'use client';

import FilterBar from '@/components/FilterBar';
import ShoppingItem from '@/components/ShoppingItem';
import {
   ButtonGroup,
   Container,
   Flex,
   IconButton,
   Pagination,
   Text,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function Shopping() {
   return (
      <Container maxW={'7xl'}>
         <FilterBar />
         <Flex m={2}>
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
         </Flex>
         <Flex m={2}>
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
         </Flex>
         <Flex m={2}>
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
         </Flex>

         {/* pagination */}
         <Pagination.Root count={20} pageSize={2} defaultPage={1} m={'0 auto'} w={'100%'} textAlign={'center'} p={'4'}>
            <ButtonGroup variant="ghost" size="sm">
               <Pagination.PrevTrigger asChild color={'black'}>
                  <IconButton _hover={{color:'white'}}>
                     <LuChevronLeft />
                  </IconButton>
               </Pagination.PrevTrigger>
               <Pagination.Items
               color='black'
                  render={page => (
                     <IconButton variant={{ base: 'ghost', _selected: 'outline' }} _hover={{color:'white'}}>{page.value}</IconButton>
                  )}
               />
               <Pagination.NextTrigger asChild color={'black'}>
                  <IconButton _hover={{color:'white'}}>
                     <LuChevronRight />
                  </IconButton>
               </Pagination.NextTrigger>
            </ButtonGroup>
         </Pagination.Root>
      </Container>
   );
}

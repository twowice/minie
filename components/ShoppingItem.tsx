import { Box, Button, Flex, VStack, Image, Text, HStack, AspectRatio } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ShoppingItem({ item }) {
   const [isCartActivity, setIsCartActivity] = useState(false);
   const [isLike, setIsLike] = useState(false);

   return (
      <Link href={`/shoppingdetail/${item.id}`} passHref>
         <VStack
            w={'100%'}
            minW={0}
            border={'1px solid black'}
            justifyContent={'space-between'}
            overflow={'hidden'}
            h={'100%'}
         >
            <AspectRatio ratio={1} w={'100%'}>
               <Box position={'relative'}>
                  <Image src={'/images/image 18-1.png'} alt="test" objectFit="cover" w={'100%'} />
                  <HStack
                     justifyContent={'space-between'}
                     w={'100%'}
                     alignItems={'center'}
                     position={'absolute'}
                     p={'4px 8px'}
                     top={0}
                  >
                     <TypeBadge typeName={item.type} />
                     <Flex alignItems={'center'} gap={'8px'}>
                        <Button
                           size={'xs'}
                           width={'24px'}
                           bgColor={'transparent'}
                           cursor={'pointer'}
                           aria-label="장바구니"
                           onClick={() => {
                              setIsCartActivity(prev => !prev);
                           }}
                           _hover={{ opacity: 0.5 }}
                        >
                           {isCartActivity ? (
                              <MdOutlineShoppingCart color="#fa6d6d" />
                           ) : (
                              <MdOutlineShoppingCart color="#898989" />
                           )}
                        </Button>
                        <Button
                           size={'xs'}
                           bgColor={'transparent'}
                           width={'24px'}
                           cursor={'pointer'}
                           aria-label="좋아요"
                           onClick={() => {
                              setIsLike(prev => !prev);
                           }}
                           _hover={{ opacity: 0.5 }}
                        >
                           {isLike ? <MdFavoriteBorder color="#fa6d6d" /> : <MdFavoriteBorder color="#898989" />}
                        </Button>
                     </Flex>
                  </HStack>
               </Box>
            </AspectRatio>
            <Flex
               alignItems={'flex-start'}
               color={'black'}
               m={'4 8px'}
               h={'100%'}
               direction={'column'}
               p={'2'}
               gap={'2'}
               w={'100%'}
            >
               <Text fontSize={'16px'} fontWeight={'700'}>
                  {item.price.toLocaleString()}원
               </Text>
               <Flex justifyContent={'space-between'} alignItems={'center'} w={'100%'}>
                  <Text fontSize={'12px'} fontWeight={'500'}>
                     {item.name}
                  </Text>
                  <TypeBadge typeName={item.skincare} />
               </Flex>
               <Text fontSize={'12px'} fontWeight={'300'} color={'rgba(0,0,0,0.6)'} h={'100%'}>
                  {item.description}
               </Text>
            </Flex>
         </VStack>
      </Link>
   );
}

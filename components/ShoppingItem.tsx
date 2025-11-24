import { Box, Button, Flex, VStack, Image, Text, HStack, AspectRatio } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
// import { useEffect, useState } from 'react';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import Link from 'next/link';
import { useCart } from '@/contexts/ShoppingCartContext';

export default function ShoppingItem({ item }: { item: any }) {
   console.log('Item Data:', item);
   // const [isCartActivity, setIsCartActivity] = useState(false);
   // const [isLike, setIsLike] = useState(false);

   //context
   const { isItemCart, toggleCart, toggleLike, isLiked } = useCart();

   //좋아요/장바구니
   const isItemLike = isLiked(item.id);
   const isItemInCart = isItemCart(item.id);

   //toggle
   const handleCartClick = e => {
      e.preventDefault();
      e.stopPropagation();
      toggleCart(item);
   };
   const handleLikeClick = e => {
      e.preventDefault();
      e.stopPropagation();
      toggleLike(item);
   };

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
                  <Image src={item.image} alt="product-image" objectFit="cover" w={'100%'} />
                  <HStack
                     justifyContent={'space-between'}
                     w={'100%'}
                     alignItems={'center'}
                     position={'absolute'}
                     p={'4px 8px'}
                     top={0}
                  >
                     <Box minW={'100px'}>
                        <TypeBadge typeName={item.skin_type} />
                     </Box>
                     <Flex alignItems={'center'} gap={'8px'}>
                        <Button
                           size={'md'}
                           width={'20px'}
                           bgColor={'transparent'}
                           cursor={'pointer'}
                           aria-label="장바구니"
                           onClick={handleCartClick}
                           _hover={{ opacity: 0.5 }}
                        >
                           {isItemInCart ? (
                              <MdOutlineShoppingCart color="#fa6d6d" />
                           ) : (
                              <MdOutlineShoppingCart color="#898989" />
                           )}
                        </Button>
                        <Button
                           size={'md'}
                           bgColor={'transparent'}
                           width={'20px'}
                           cursor={'pointer'}
                           aria-label="좋아요"
                           onClick={handleLikeClick}
                           _hover={{ opacity: 0.5 }}
                        >
                           {isItemLike ? <MdFavoriteBorder color="#fa6d6d" /> : <MdFavoriteBorder color="#898989" />}
                        </Button>
                     </Flex>
                  </HStack>
               </Box>
            </AspectRatio>
            <Box color={'black'} h={'100%'} p={'8px'} w={'100%'}>
               <Flex
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={'4px'}
               >
                  {item.discount_amount > 0 && (
                     <Text fontSize={'24px'} fontWeight={'700'}>
                        {(item.price * (100 - getDiscountRate(item.price, item.discount_amount))) / 100}원
                     </Text>
                  )}
                  {item.discount_amount === 0 && (
                     <Text fontSize={'24px'} fontWeight={'700'}>
                        {item.price}원
                     </Text>
                  )}

                  {item.discount_amount > 0 && (
                     <Flex alignContent={'center'} gap={'8px'}>
                        <Text fontWeight={'medium'} color={'#FA6D6D'} fontSize={'16px'}>
                           {getDiscountRate(item.price, item.discount_amount)}%
                        </Text>
                        <Flex gap={'4px'}>
                           <Text fontSize={'16px'} textDecoration={'line-through'} color={'#808080'}>
                              {item.price.toLocaleString()}
                           </Text>
                           <Text fontSize={'16px'} color={'#808080'}>
                              원
                           </Text>
                        </Flex>
                     </Flex>
                  )}
               </Flex>
               <Flex justifyContent={'space-between'} alignItems={'center'} mb={'8px'}>
                  <Text fontSize={'20px'} fontWeight={'500'}>
                     {item.brand}
                  </Text>
                  <TypeBadge typeName={item.skincare} />
               </Flex>
               <Text
                  fontSize={'16px'}
                  fontWeight={'300'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  mb={'4px'}
               >
                  {item.name}
               </Text>
               <Text fontSize={'12px'} fontWeight={'300'} color={'rgba(0,0,0,0.6)'} h={'100%'}>
                  {item.description}
               </Text>
            </Box>
         </VStack>
      </Link>
   );
}

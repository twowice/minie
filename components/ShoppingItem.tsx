import {
   Box,
   Button,
   Flex,
   VStack,
   Image,
   Text,
   HStack,
   AspectRatio,
   Skeleton,
   SkeletonText,
   IconButton,
} from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
// import { useEffect, useState } from 'react';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import Link from 'next/link';
import { useCart } from '@/contexts/ShoppingCartContext';
import { useEffect, useState } from 'react';
import HeartFilledIcon from './ui/HeartIcon';

const ShoppingItemSkeleton = () => {
   return (
      <VStack
         minW={0}
         overflow={'hidden'}
         h={'100%'}
         bg={'white'}
         borderRadius={'lg'}
         boxShadow={'sm'}
         gap={0}
         justifyContent={'space-between'}
      >
         <AspectRatio ratio={1} w={'100%'}>
            <Skeleton w={'100%'} h={'100%'} />
         </AspectRatio>
         <Box p={4} w={'100%'} h={'100%'}>
            <Flex justifyContent={'space-between'} alignItems={'center'} mb={1}>
               <Skeleton h={'30px'} w={'50%'} borderRadius={'4px'} />
               <Skeleton h={'30px'} w={'40%'} borderRadius={'4px'} />
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'center'} mb={'8px'}>
               <Skeleton h={'24px'} w={'40%'} borderRadius={'4px'} />
               <Skeleton h={'24px'} w={'30%'} borderRadius={'full'} />
            </Flex>
            <Skeleton h={'40px'} w={'100%'} borderRadius={'4px'} mb={2} />
         </Box>
      </VStack>
   );
};
export default function ShoppingItem({ item }: { item: any }) {
   console.log('Item Data:', item);
   const [isLoading, setIsLoading] = useState(true);
   // const [isCartActivity, setIsCartActivity] = useState(false);
   // const [isLike, setIsLike] = useState(false);

   //context
   const { isItemCart, toggleCart, toggleLike, isLiked } = useCart();

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
   }, []);

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

   if (isLoading) {
      return <ShoppingItemSkeleton />;
   }

   return (
      <Link href={`/shoppingdetail/${item.id}`} passHref style={{ height: '100%' }}>
         <VStack
            w={'100%'}
            h={'100%'}
            minW={0}
            bg={'white'}
            borderRadius={'lg'}
            boxShadow={'sm'}
            justifyContent={'space-between'}
            overflow={'hidden'}
            opacity={isLoading ? 0 : 1}
            transition={'all 0.3s ease'}
            _hover={{
               boxShadow: 'md',
               transform: 'translateY(-4px)',
            }}
            gap={0}
            position={'relative'}
         >
            <AspectRatio ratio={1} w={'100%'}>
               <Box position={'relative'}>
                  <Image src={item.image} alt={item.name} objectFit="cover" w={'100%'} />
                  <HStack
                     justifyContent={'space-between'}
                     w={'100%'}
                     alignItems={'flex-start'}
                     position={'absolute'}
                     p={3}
                     top={0}
                     zIndex={2}
                  >
                     <Box>{item.skin_type && <TypeBadge typeName={item.skin_type} />}</Box>
                     <Flex direction={'column'} gap={2}>
                        <Button
                           size={'sm'}
                           width={'32px'}
                           h={'32px'}
                           p={0}
                           bgColor={'rgba(255, 255, 255, 0.8)'}
                           backdropFilter={'blur(4px)'}
                           borderRadius={'full'}
                           cursor={'pointer'}
                           aria-label="장바구니"
                           onClick={handleCartClick}
                           _hover={{ bgColor: 'white', transform: 'scale(1.1)' }}
                           boxShadow={'sm'}
                        >
                           {isItemInCart ? (
                              <MdOutlineShoppingCart color="#fa6d6d" />
                           ) : (
                              <MdOutlineShoppingCart color="#898989" />
                           )}
                        </Button>
                        <IconButton
                           onClick={handleLikeClick}
                           size={'sm'}
                           width={'32px'}
                           h={'32px'}
                           p={0}
                           bgColor={'rgba(255, 255, 255, 0.8)'}
                           backdropFilter={'blur(4px)'}
                           borderRadius={'4px'}
                           boxShadow={'sm'}
                           _hover={{ bgColor: 'white', transform: 'scale(1.1)' }}
                           cursor={'pointer'}
                        >
                           <HeartFilledIcon
                              filledColor={isItemLike ? '#FA6D6D' : 'none'}
                              strokeColor={isItemLike ? '#FA6D6D' : '#CCCCCC'}
                           />
                        </IconButton>
                     </Flex>
                  </HStack>
               </Box>
            </AspectRatio>
            <Box color={'black'} h={'100%'} p={4} w={'100%'} zIndex={3}>
               <Flex
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={'4px'}
                  mb={1}
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

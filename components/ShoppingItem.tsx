import { Box, Button, Flex, VStack, Image, Text, HStack, AspectRatio, IconButton } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import Link from 'next/link';
import { useCart } from '@/contexts/ShoppingCartContext';
import { useState } from 'react';
import HeartFilledIcon from './ui/HeartIcon';
import { Product } from '@/app/api/products/product';
import { CartItem } from '@/app/api/cart/cart';
import { ShoppingItemSkeleton } from './ShoppingItemSkeleton';

export default function ShoppingItem({ item }: { item: Product }) {
   console.log('Item Data:', item);
   const [isReady, setIsReady] = useState(false);

   //context
   const { isItemCart, toggleCart, toggleLike, isLiked } = useCart();

   //좋아요/장바구니
   const isItemLike = isLiked(item.id);
   const isItemInCart = isItemCart(item.id);

   //toggle
   const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCart(item as unknown as CartItem);
   };
   const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleLike(item as unknown as CartItem);
   };

   return (
      <Box position={'relative'} h={'100%'} w={'100%'}>
         {/* 로딩 중일 때 보여줄 전체 스켈레톤 
            - isReady가 false일 때만 절대 위치(absolute)로 덮어씌움
            - zIndex를 높여서 실제 컨텐츠를 가림 */}
         {!isReady && (
            <Box position={'absolute'} top={0} left={0} w={'100%'} h={'100%'} zIndex={10}>
               <ShoppingItemSkeleton />
            </Box>
         )}
         {/* 실제 컨텐츠 (이미지 + 텍스트)
            - 일단 렌더링은 되지만 opacity로 숨겨둠 (투명 상태)
            - 이미지가 로드되면(onLoad) isReady가 true가 되면서 opacity가 1이 됨 */}
         <Link href={`/shoppingdetail/${item.id}`} passHref style={{ height: '100%', display: 'block' }}>
            <VStack
               w={'100%'}
               h={'100%'}
               minW={0}
               bg={'white'}
               borderRadius={'lg'}
               boxShadow={'sm'}
               justifyContent={'space-between'}
               overflow={'hidden'}
               opacity={isReady ? 1 : 0}
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
                     <Image
                        src={item.image}
                        alt={item.name}
                        objectFit="cover"
                        w={'100%'}
                        //이미지 로드 완료 시 보여짐
                        onLoad={() => setIsReady(true)}
                        //이미지 로드 실패하더라도 보여짐
                        onError={() => setIsReady(true)}
                     />
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
                                 strokeColor={isItemLike ? '#FA6D6D' : '#A6A6A6'}
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
                           {(item.price - item.discount_amount).toLocaleString()} 원
                        </Text>
                     )}
                     {item.discount_amount === 0 && (
                        <Text fontSize={'24px'} fontWeight={'700'}>
                           {item.price.toLocaleString()}원
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
      </Box>
   );
}

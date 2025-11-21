import { Box, Button, Flex, VStack, Image, Text, HStack, AspectRatio, Skeleton, SkeletonText } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
import Link from 'next/link';
import { useCart } from '@/contexts/ShoppingCartContext';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import { useMemo } from 'react';

const CARD_BORDER_RADIUS = '8px';
const DESCRIPTION_HEIGHT = '36px';

interface ShoppingItemProps {
   item?: any;
   isLoading?: boolean;
}

export default function ShoppingItem({ item, isLoading = false }: ShoppingItemProps) {
   const { isItemCart, toggleCart, toggleLike, isLiked } = useCart();

   const { cleanItem, finalPrice, discountRate, safePrice, safeDiscountAmount } = useMemo(() => {
      if (!item) {
         return {
            cleanItem: { id: 0 },
            finalPrice: 0,
            discountRate: 0,
            safePrice: 0,
            safeDiscountAmount: 0,
         };
      }

      const sPrice = Number(item.price) || 0;
      const sDiscountAmount = Number(item.discount_amount) || 0;
      const dRate = sDiscountAmount > 0 ? getDiscountRate(sPrice, sDiscountAmount) : 0;
      const fPrice = sDiscountAmount > 0 ? Math.floor((sPrice * (100 - dRate)) / 100) : sPrice;

      const cItem = {
         id: Number(item.id),
         name: item.name,
         title: item.name,
         brand: item.brand,
         image: item.image || '/images/image 18-1.png',
         price: sPrice,
         discountedPrice: fPrice,
         discount_amount: sDiscountAmount,
         discountAmount: sDiscountAmount,
         isDiscounted: sDiscountAmount > 0,
         quantity: 1,
         skincare: item.skincare,
         skin_type: item.skin_type,
      };

      return {
         cleanItem: cItem,
         finalPrice: fPrice,
         discountRate: dRate,
         safePrice: sPrice,
         safeDiscountAmount: sDiscountAmount,
      };
   }, [item]);
   const isItemInCart = isItemCart(cleanItem.id);
   const isItemLike = isLiked(cleanItem.id);

   if (!item) return null;

   if (isLoading) {
      return (
         <VStack
            w="100%"
            minW={0}
            border="1px solid lightgray"
            justifyContent="space-between"
            overflow="hidden"
            h="100%"
            gap={0}
            borderRadius={CARD_BORDER_RADIUS}
            bg="white"
         >
            <AspectRatio ratio={1} w="100%">
               <Skeleton w="100%" h="100%" />
            </AspectRatio>
            <Box p="8px" w="100%">
               <Flex alignItems="center" justifyContent="space-between" mb="8px" h="30px">
                  <Skeleton h="24px" w="40%" />
                  <Skeleton h="16px" w="20%" />
               </Flex>
               <Flex justifyContent="space-between" alignItems="center" mb="8px" h="24px">
                  <Skeleton h="20px" w="30%" />
                  <Skeleton h="20px" w="20px" borderRadius="full" />
               </Flex>
               <Skeleton h="20px" w="70%" mb="4px" />
               <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="12px" />
            </Box>
         </VStack>
      );
   }

   const handleCartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCart(cleanItem);
   };

   const handleLikeClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleLike(cleanItem);
   };

   return (
      <Link
         href={`/shoppingdetail/${item.id}`}
         passHref
         style={{ display: 'block', height: '100%', textDecoration: 'none' }}
      >
         <VStack
            w="100%"
            minW={0}
            border="1px solid lightgray"
            justifyContent="space-between"
            overflow="hidden"
            h="100%"
            gap={0}
            borderRadius={CARD_BORDER_RADIUS}
            _hover={{ borderColor: '#FA6D6D' }}
            transition="border-color 0.2s"
            bg="white"
         >
            <AspectRatio ratio={1} w="100%">
               <Box position="relative">
                  <Image src={item.image || '/images/image 18-1.png'} alt={item.name} objectFit="cover" w="100%" />
                  <HStack
                     justifyContent="space-between"
                     w="100%"
                     alignItems="center"
                     position="absolute"
                     p="4px 8px"
                     top={0}
                  >
                     <Box minW="100px">
                        <TypeBadge typeName={item.skin_type} />
                     </Box>
                     <Flex alignItems="center" gap="8px">
                        {/* 장바구니 버튼 수정 */}
                        <Button
                           variant="unstyled"
                           minW="unset"
                           p={0} // 패딩 0 강제
                           display="flex"
                           alignItems="center"
                           justifyContent="center"
                           w="24px" // 터치 영역 확보를 위해 약간 키움
                           h="24px"
                           cursor="pointer"
                           aria-label="장바구니"
                           onClick={handleCartClick}
                           bg="transparent" // 배경 투명 명시
                           _focus={{ boxShadow: 'none', outline: 'none' }} // 검정 테두리/그림자 제거
                           _active={{ bg: 'transparent', transform: 'scale(0.95)' }} // 클릭 시 배경색 변경 방지
                           _hover={{ transform: 'scale(1.1)' }}
                           zIndex={2} // Link보다 위에 위치하도록
                        >
                           <MdOutlineShoppingCart size={20} color={isItemInCart ? '#fa6d6d' : '#898989'} />
                        </Button>

                        {/* 좋아요 버튼 수정 */}
                        <Button
                           variant="unstyled"
                           minW="unset"
                           p={0}
                           display="flex"
                           alignItems="center"
                           justifyContent="center"
                           w="24px"
                           h="24px"
                           cursor="pointer"
                           aria-label="좋아요"
                           onClick={handleLikeClick}
                           bg="transparent"
                           _focus={{ boxShadow: 'none', outline: 'none' }} // 검정 테두리/그림자 제거
                           _active={{ bg: 'transparent', transform: 'scale(0.95)' }}
                           _hover={{ transform: 'scale(1.1)' }}
                           zIndex={2}
                        >
                           <MdFavoriteBorder size={20} color={isItemLike ? '#fa6d6d' : '#898989'} />
                        </Button>
                     </Flex>
                  </HStack>
               </Box>
            </AspectRatio>

            <Box color="black" h="100%" p="8px" w="100%">
               <Flex alignItems="center" justifyContent="space-between" gap="4px" mb="8px" h="30px">
                  <Text fontSize="24px" fontWeight="700" lineHeight="30px">
                     {finalPrice.toLocaleString()}원
                  </Text>
                  {safeDiscountAmount > 0 && (
                     <Flex alignContent="center" gap="8px" alignItems="center">
                        <Text fontWeight="medium" color="#FA6D6D" fontSize="16px" lineHeight="1">
                           {discountRate}%
                        </Text>
                        <Flex gap="4px" alignItems="center">
                           <Text fontSize="16px" color="#808080" textDecoration="line-through" lineHeight="1">
                              {safePrice.toLocaleString()}
                           </Text>
                           <Text fontSize="16px" color="#808080" lineHeight="1">
                              원
                           </Text>
                        </Flex>
                     </Flex>
                  )}
               </Flex>

               <Flex justifyContent="space-between" alignItems="center" mb="8px" h="24px">
                  <Text fontSize="20px" fontWeight="500" lineHeight="24px">
                     {item.brand}
                  </Text>
                  <TypeBadge typeName={item.skincare} />
               </Flex>

               <Text
                  fontSize="16px"
                  fontWeight="300"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  mb="4px"
                  lineHeight="20px"
                  h="20px"
               >
                  {item.name}
               </Text>

               <Text
                  fontSize="12px"
                  fontWeight="300"
                  color="rgba(0,0,0,0.6)"
                  h={DESCRIPTION_HEIGHT}
                  lineHeight="18px"
                  overflow="hidden"
                  display="-webkit-box"
                  style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
               >
                  {item.description}
               </Text>
            </Box>
         </VStack>
      </Link>
   );
}

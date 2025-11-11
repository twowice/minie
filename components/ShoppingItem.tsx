import { Box, Button, Flex, HStack, Image, Text } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
import { useState } from 'react';
export default function ShoppingItem() {
   const [isCartActivity, setIsCartActivity] = useState(false);
   const [isLike, setIsLike] = useState(false);
   return (
      <>
         <Box >
            <Image src={'/images/image 18-1.png'} w={'200px'} h={'280px'} position={'absolute'} alt="test" />
            <Box w={'200px'} h={'280px'}>
               <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  position={'relative'}
                  p={'4px 8px'}
               >
                  <HStack>
                     <TypeBadge typeName={'hydration'} />
                  </HStack>
                  <Box display={'flex'} alignItems={'center'} gap={'8px'}>
                     <Button
                        size={'xs'}
                        width={'24px'}
                        cursor={'pointer'}
                        aria-label="장바구니"
                        onClick={() => {
                           setIsCartActivity(prev => !prev);
                        }}
                     >
                        {isCartActivity ? <MdOutlineShoppingCart color="#fa6d6d" /> : <MdOutlineShoppingCart />}
                     </Button>
                     <Button
                        size={'xs'}
                        width={'24px'}
                        w={'24px'}
                        cursor={'pointer'}
                        aria-label="좋아요"
                        onClick={() => {
                           setIsLike(prev => !prev);
                        }}
                     >
                        {isLike ? <MdFavoriteBorder color="#fa6d6d" /> : <MdFavoriteBorder />}
                     </Button>
                  </Box>
               </Box>
            </Box>
            <Flex color={'black'} m={'0 8px'} flexDirection={'column'} position={'relative'}>
               <Text fontSize={'16px'} fontWeight={'700'}>
                  ${}원
               </Text>
               <Text fontSize={'12px'} fontWeight={'400'}>
                  ${}
               </Text>
               <Text fontSize={'12px'} fontWeight={'200'} color={'rgba(0,0,0,0.6)'}>
                  ${}
               </Text>
            </Flex>
         </Box>
      </>
   );
}

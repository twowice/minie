import { Box, Button, Flex, VStack, Image, Text, HStack, AspectRatio } from '@chakra-ui/react';
import TypeBadge from './Badge';
import { MdFavoriteBorder, MdOutlineShoppingCart } from 'react-icons/md';
import { useState } from 'react';
import items from '@/data/items.json';

export default function ShoppingItem({item}) {
   const [isCartActivity, setIsCartActivity] = useState(false);
   const [isLike, setIsLike] = useState(false);

   return (
      <VStack w={'100%'} border={'1px solid black'} justifyContent={'center'} overflow={'hidden'}>
         <AspectRatio ratio={1} w={'100%'}>
            <Box>
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
                  </Flex>
               </HStack>
            </Box>
         </AspectRatio>
         <Flex
            alignItems={'flex-start'}
            color={'black'}
            m={'4 8px'}
            h={'auto'}
            direction={'column'}
            p={'2'}
            gap={'2'}
            w={'100%'}
         >
            <Text fontSize={'16px'} fontWeight={'700'}>
               {item.price.toLocaleString()}원
            </Text>
            <Text fontSize={'12px'} fontWeight={'500'}>
               {item.name}
            </Text>
            <Text fontSize={'12px'} fontWeight={'300'} color={'rgba(0,0,0,0.6)'}>
               {item.description}
            </Text>
         </Flex>
      </VStack>
   );
}

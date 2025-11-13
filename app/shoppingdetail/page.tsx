'use client';
import TypeBadge from '@/components/Badge';
import { Box, Button, Container, Flex, HStack, IconButton, Image, Spacer, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaRegHeart } from 'react-icons/fa6';
export default function ShoppingDetail() {
   const [items, setItems] = useState([]);
   useEffect(() => {
      fetch('/data/items.json')
         .then(res => res.json())
         .then(data => setItems(data));
   }, []);

   return (
      <Container maxW={'7xl'} m={'20px 0'}>
         <Flex gap={'40px'} borderBottom={'rgba(204,204,204,0.8)'} paddingBottom={'40px'}>
            <Box width={'540px'} h={'540px'} border={'1px solid black'}>
               <Image src="/images/test/image18.png" alt="test" w={'100%'} h={'100%'} objectFit={'cover'} />
            </Box>
            <Flex color={'black'} direction={'column'} gap={'16px'} flex={1}>
               <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <Text fontSize={'24px'} fontWeight={'700'}>
                     아이오페
                  </Text>
                  <IconButton>
                     <FaRegHeart size={'sm'} color='#cccccc'/>
                  </IconButton>
               </Flex>
               <Text fontSize={'24px'} color={'rgba(0,0,0,0.6)'} fontWeight={'500'}>
                  타임 리페어 인텐시브 크림
               </Text>

               <Spacer />
               <Flex gap={'8px'} alignItems={'center'}>
                  <HStack fontSize={'16px'} fontWeight={'500'} gap={'4px'}>
                     <Text color={'#FA6D6D'}>20%</Text>
                     <Text color={'rgba(0,0,0,0.6)'} textDecoration={'line-through'}>
                        5000원
                     </Text>
                  </HStack>
                  <Text fontSize={'36px'} color={'#FA6D6D'} fontWeight={'700'}>
                     4000원
                  </Text>
               </Flex>
               <Flex gap={'8px'} w={'100%'} borderBottom={'1px solid #cccccc'} paddingBottom={'20px'}>
                  <TypeBadge typeName={'antiaging'} />
                  <TypeBadge typeName={'entire'} />
                  <TypeBadge typeName={'dry'} />
                  <TypeBadge typeName={'cream'} />
               </Flex>
               <Flex
                  justifyContent={'space-between'}
                  p={'8px 16px'}
                  color={'black'}
                  background={'rgba(204,204,204,0.5)'}
                  border={'rgb(204,204,204)'}
                  borderRadius={'5px'}
                  alignItems={'center'}
               >
                  <Text>구매수량</Text>
                  <Flex alignItems={'center'} gap={'8px'}>
                     <IconButton
                        opacity={'16%'}
                        rounded={'full'}
                        color={'white'}
                        bgColor={'rgba(0,0,0,0.7)'}
                        size={'xs'}
                     >
                        <FaMinus />
                     </IconButton>
                     <Text w={'30px'} textAlign={'center'}>
                        1
                     </Text>
                     <IconButton color={'white'} bgColor={'rgba(0,0,0,0.7)'} rounded={'full'} size={'xs'}>
                        <FaPlus />
                     </IconButton>
                  </Flex>
               </Flex>
               <Flex
                  justifyContent={'space-between'}
                  paddingBottom={'20px'}
                  borderBottom={'1px solid #FA6D6D'}
                  fontSize={'36px'}
                  color={'#FA6D6D'}
               >
                  <Text>상품금액 합계</Text>
                  <Text>4000원</Text>
               </Flex>
               <HStack gap={'20px'} w={'100%'}>
                  <Button border={'1px solid #cccccc'} bgColor={'white'} flex={1}>
                     장바구니
                  </Button>
                  <Button bgColor={'#FA6D6D'} color={'white'} flex={1}>
                     바로 구매
                  </Button>
               </HStack>
            </Flex>
         </Flex>
      </Container>
   );
}

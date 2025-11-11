import {
   Box,
   Button,
   Checkbox,
   CloseButton,
   Dialog,
   Flex,
   HStack,
   NativeSelect,
   NativeSelectIndicator,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdFilterListAlt } from 'react-icons/md';
import Segment from './ui/Segment';

export default function FilterBar() {
   //더미데이터
   const items = [
      { id: 1, name: '상품 1', gender: 'male', price: 9000 },
      { id: 2, name: '상품 2', gender: 'female', price: 12000 },
      { id: 3, name: '상품 3', gender: 'male', price: 18000 },
      { id: 4, name: '상품 4', gender: 'male', type: 'MyType', price: 20000 },
      { id: 5, name: '상품 5', gender: 'male', price: 5000 },
   ];

   const maxPrice = items.reduce((prev, curr) => (curr.price > prev.price ? curr : prev)).price;

   const { open, onOpen, onClose } = useDisclosure();
   const [male, setMale] = useState(false);
   const [female, setFemale] = useState(false);
   const [dialog, setDialog] = useState(false);
   const [myType, setMyType] = useState(false);
   const [data, setData] = useState(items);

   const [filterMale, setFilterMale] = useState(false);
   const [filterFemale, setFilterFemale] = useState(false);
   const [filterBoth, setFilterBoth] = useState(true);
   const [filterPrice, setFilterPrice] = useState([]);

   useEffect(() => {
      let selected = items;

      if (male && !female) {
         selected = selected.filter(item => item.gender === 'male');
      } else if (!male && female) {
         selected = selected.filter(item => item.gender === 'female');
      } else if (male && female) {
         selected = selected.filter(item => item.gender === 'male' || item.gender === 'female');
      }

      if (myType) {
         selected = selected.filter(item => item.type === 'MyType');
      }

      setData(selected);
   }, [male, female, myType]);

   const filteredData = () => {
      let checked = items;

      if (filterBoth || filterFemale || filterMale) {
         if (filterBoth) {
         } else if (filterMale && filterFemale) {
            checked = checked.filter(item => item.gender === 'male' || item.gender === 'female');
         } else if (filterMale) {
            checked = checked.filter(item => item.gender === 'male');
         } else if (filterFemale) {
            checked = checked.filter(item => item.gender === 'female');
         }
      }

      if (filterPrice.length > 0) {
         checked = checked.filter(item => filterPrice.some(price => item.price <= price));
      }
      return checked.length;
   };

   const handleFilterDialog = () => {
      setFilterMale(true);
      setFilterFemale(true);
      setFilterBoth(true);
      setFilterPrice([10000, 15000, 20000]);
      onOpen();
   };

   const handleSaveDialog = () => {
      if (filterBoth) {
         setMale(false);
         setFemale(false);
      } else if (filterMale && filterFemale) {
         setMale(true);
         setFemale(true);
      } else {
         setMale(filterMale);
         setFemale(filterFemale);
      }
      onClose();
      setDialog(false);
   };

   const togglePrice = (price) => {
    setFilterPrice(prev => prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price])
   }

   return (
      <Flex mb={2} direction={{ base: 'column', md: 'row' }} flexDirection={'column'}>
         <Box display={'flex'} justifyContent={'space-between'} backgroundColor={'rgba(204,204,204,0.16)'} p={'8px'}>
            <Box display={'flex'} gap={'10px'}>
               <Button
                  color={dialog ? '#fa6d6d' : 'rgba(0,0,0,0.32)'}
                  bg={'white'}
                  border={'1px solid rgba(0,0,0,0.32)'}
                  borderRadius={'2px'}
                  w={'24px'}
                  h={'24px'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  onClick={() => {
                     handleFilterDialog(); //Dialog 트리거
                     setDialog(prev => !prev);
                  }}
               >
                  <MdFilterListAlt />
               </Button>
               <Button
                  color={male ? 'white' : 'rgba(0,0,0,0.32)'}
                  bg={male ? '#fa6d6d' : 'white'}
                  border={male ? 'transparent' : '1px solid rgba(0,0,0,0.32)'}
                  borderRadius={'2px'}
                  w={'24px'}
                  h={'24px'}
                  fontSize={'12px'}
                  textAlign={'center'}
                  onClick={() => {
                     setMale(prev => !prev);
                  }}
               >
                  남
               </Button>
               <Button
                  color={female ? 'white' : 'rgba(0,0,0,0.32)'}
                  bg={female ? '#fa6d6d' : 'white'}
                  border={female ? 'transparent' : '1px solid rgba(0,0,0,0.32)'}
                  borderRadius={'2px'}
                  w={'24px'}
                  h={'24px'}
                  fontSize={'12px'}
                  textAlign={'center'}
                  onClick={() => {
                     setFemale(prev => !prev);
                  }}
               >
                  여
               </Button>
               <Button
                  color={myType ? 'white' : 'rgba(0,0,0,0.32)'}
                  bg={myType ? '#fa6d6d' : 'white'}
                  border={myType ? 'transparent' : '1px solid rgba(0,0,0,0.32)'}
                  borderRadius={'2px'}
                  h={'24px'}
                  fontSize={'12px'}
                  textAlign={'center'}
                  p={'0 4px'}
                  onClick={() => {
                     setMyType(prev => !prev);
                  }}
               >
                  마이타입
               </Button>
            </Box>
            <Box display={'flex'} gap={'16px'} fontSize={'12px'} alignItems={'center'} color={'rgba(0,0,0,0.4)'}>
               <Text>총 {data.length}개</Text>
               <NativeSelect.Root size={'xs'} w={'60px'} variant={'plain'}>
                  <NativeSelect.Field padding={'2px 4px'} h={'24px'} color={'rgba(0,0,0,0.4)'}>
                     <option value="인기순" defaultChecked>
                        인기순
                     </option>
                     <option value="최신순">최신순</option>
                  </NativeSelect.Field>
                  <NativeSelectIndicator />
               </NativeSelect.Root>
            </Box>
         </Box>
         <Dialog.Root placement={'center'} open={open} onClose={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
               <Dialog.Content bg="white" color="black">
                  <Dialog.CloseTrigger />
                  <Dialog.Header>
                     <Dialog.Title>필터</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                     <Flex flexDirection={'column'} gap={'16px'} alignItems={'flex-start'}>
                        <Flex direction={'column'} gap={'8px'}>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              성별
                           </Text>
                           <HStack>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterBoth}
                                 onCheckedChange={e => {
                                    setFilterBoth(e.checked);
                                    if (e.checked) {
                                       setFilterMale(false);
                                       setFilterFemale(false);
                                    }
                                 }}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>남녀무관</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterMale}
                                 onCheckedChange={e => {
                                    setFilterMale(e.checked);
                                    if (e.checked) {
                                       setFilterBoth(false);
                                    }
                                 }}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>남성</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterFemale}
                                 onCheckedChange={e => {
                                    setFilterFemale(e.checked);
                                    if (e.checked) {
                                       setFilterBoth(false);
                                    }
                                 }}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>여성</Checkbox.Label>
                              </Checkbox.Root>
                           </HStack>
                        </Flex>
                        <Flex direction={'column'} gap={'8px'}>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              가격
                           </Text>
                           <HStack>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterPrice.includes(10000)}
                                 onCheckedChange={() => togglePrice(10000)}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>10,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterPrice.includes(15000)}
                                 onCheckedChange={() => togglePrice(15000)}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>15,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 checked={filterPrice.includes(20000)}
                                 onCheckedChange={() => togglePrice(20000)}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>20,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                           </HStack>
                        </Flex>
                        <Flex direction={'column'} gap={'8px'} w={'100%'}>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              상세옵션
                           </Text>
                           <Segment />
                        </Flex>
                     </Flex>
                  </Dialog.Body>
                  <Dialog.Footer>
                     <Button
                        onClick={() => {
                           handleSaveDialog();
                           setDialog(prev => !prev);
                        }}
                        bg="#FA6D6D"
                        color="white"
                     >
                        {filteredData()}개의 상품 보러가기
                     </Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                     <CloseButton
                        size={'sm'}
                        onClick={() => {
                           handleSaveDialog();
                           setDialog(false);
                        }}
                        bg="white"
                        color="black"
                     />
                  </Dialog.CloseTrigger>
               </Dialog.Content>
            </Dialog.Positioner>
         </Dialog.Root>
      </Flex>
   );
}

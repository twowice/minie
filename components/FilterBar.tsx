'use client';

import {
   Box,
   Button,
   Checkbox,
   CloseButton,
   Dialog,
   Flex,
   HStack,
   IconButton,
   NativeSelect,
   NativeSelectIndicator,
   Tag,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { MdFilterListAlt } from 'react-icons/md';
import Segment from './ui/Segment';
// import items from '@/data/items.json'; //더미데이터
import { RiResetLeftFill } from 'react-icons/ri';
import { FilterBarProps } from '@/app/api/products/product';

const priceLabels: Record<number, string> = {
   10000: '10,000원 이하',
   15000: '15,000원 이하',
   20000: '20,000원 이하',
};
export default function FilterBar({ onDataFiltered, category, list = [] }: FilterBarProps) {
   // --- 상단 버튼 필터 State ---
   const [male, setMale] = useState<boolean>(false);
   const [female, setFemale] = useState<boolean>(false);
   // const [myType, setMyType] = useState(false);
   const [price, setPrice] = useState<number[]>([]);

   // --- 다이얼로그 ---
   const { open, onOpen, onClose } = useDisclosure();
   const [dialog, setDialog] = useState<boolean>(false);
   const [filterMale, setFilterMale] = useState<boolean>(true);
   const [filterFemale, setFilterFemale] = useState<boolean>(true);
   const [filterBoth, setFilterBoth] = useState<boolean>(true);
   const [filterPrice, setFilterPrice] = useState<number[]>([]);

   // ---상세옵션 ---
   //skincare
   const [skincare, setSkincare] = useState<string[]>([]);
   //use
   const [use, setUse] = useState<string[]>([]);
   //type
   const [type, setType] = useState<string[]>([]);
   //style
   const [style, setStyle] = useState<string[]>([]);

   // 필터 상세옵션
   const [filterSkincare, setFilterSkincare] = useState<string[]>([]);
   const [filterUse, setFilterUse] = useState<string[]>([]);
   const [filterType, setFilterType] = useState<string[]>([]);
   const [filterStyle, setFilterStyle] = useState<string[]>([]);

   // --- 최종 데이터 ---
   // const [data, setData] = useState(list);
   const [sortOrder, setSortOrder] = useState<string>('낮은 가격 순');

   const categoryItems = useMemo(() => {
      if (!list) return [];
      return list.filter(item => item.category === category);
   }, [list, category]);

   //초기화
   useEffect(() => {
      //상단필터
      setMale(false);
      setFemale(false);
      // setMyType(false);
      setPrice([]);

      //상세필터
      setSkincare([]);
      setUse([]);
      setType([]);
      setStyle([]);

      //다이얼로그 상태
      setFilterBoth(true);
      setFilterMale(false);
      setFilterFemale(false);
      setFilterPrice([]);
      setFilterSkincare([]);
      setFilterUse([]);
      setFilterType([]);
      setFilterStyle([]);

      //정렬
      setSortOrder('낮은 가격 순');

      //다이얼로그 닫기
      setDialog(false);
      // onClose();
   }, [category]);

   //동작
   useEffect(() => {
      const items = list.filter(item => item.category === category);
      let selected = [...items];

      selected = selected.filter(p => {
         if (female && !male && !p.gender.includes('여성')) return false;
         if (male && !female && !p.gender.includes('남성')) return false;
         // if (myType && p.mytype !== '마이타입') return false;
         if (price.length > 0 && !price.some(priceCeiling => p.price <= priceCeiling)) return false;
         if (skincare.length > 0 && p.skincare && !skincare.includes(p.skincare)) return false;
         if (use.length > 0 && p.use && !use.includes(p.use)) return false;
         if (type.length > 0 && p.type && !type.includes(p.type)) return false;
         if (style.length > 0 && p.style && !style.includes(p.style)) return false;
         return true;
      });

      selected.sort((a, b) => {
         const realPriceA = a.is_discounted ? a.price - a.discount_amount : a.price;
         const realPriceB = b.is_discounted ? b.price - b.discount_amount : b.price;

         if (sortOrder === '낮은 가격 순') {
            return realPriceA - realPriceB;
         } else if (sortOrder === '높은 가격 순') {
            return realPriceB - realPriceA;
         }
         return 0;
      });

      // setData(selected);
      onDataFiltered(selected);
   }, [male, female, price, sortOrder, skincare, use, type, style, list, category]);

   const filteredData = (): number => {
      let checked = [...categoryItems];

      // if (myType) {
      //    checked = checked.filter(p => p.mytype === '마이타입');
      // }

      const genderFilter: string[] = [];
      if (filterBoth || (filterMale && filterFemale) || (!filterMale && !filterFemale)) {
         genderFilter.push('남성', '여성');
      } else if (filterMale) {
         genderFilter.push('남성');
      } else if (filterFemale) {
         genderFilter.push('여성');
      }

      if (genderFilter.length > 0) {
         checked = checked.filter(item => genderFilter.some(g => item.gender.includes(g)));
      }

      if (filterPrice.length > 0) {
         checked = checked.filter(item => filterPrice.some(price => item.price <= price));
      }

      if (filterSkincare.length > 0) {
         checked = checked.filter(item => filterSkincare.includes(item.skincare));
      }
      if (filterUse.length > 0) {
         checked = checked.filter(item => filterUse.includes(item.use));
      }
      if (filterType.length > 0) {
         checked = checked.filter(item => filterType.includes(item.type));
      }
      if (filterStyle.length > 0) {
         checked = checked.filter(item => filterStyle.includes(item.style));
      }
      return checked.length;
   };

   const handleFilterDialog = () => {
      setFilterMale(male);
      setFilterFemale(female);
      setFilterBoth(!female && !male);
      setFilterPrice(price);

      setFilterSkincare(skincare);
      setFilterUse(use);
      setFilterType(type);
      setFilterStyle(style);

      onOpen();
   };

   const handleSaveDialog = () => {
      if (filterBoth) {
         setMale(false);
         setFemale(false);
      } else {
         setMale(filterMale);
         setFemale(filterFemale);
      }
      setPrice(filterPrice);

      setSkincare(filterSkincare);
      setUse(filterUse);
      setType(filterType);
      setStyle(filterStyle);
      onClose();
      setDialog(false);
   };
   const handleReset = () => {
      setFilterBoth(true);
      setFilterMale(false);
      setFilterFemale(false);
      setFilterPrice([]);
      setFilterSkincare([]);
      setFilterUse([]);
      setFilterType([]);
      setFilterStyle([]);
   };

   const removeFilterTag = (type: string, value: string | number) => {
      if (type === 'gender') {
         if (value === 'both') setFilterBoth(false);
         if (value === 'male') setFilterMale(false);
         if (value === 'female') setFilterFemale(false);
      }
      if (type === 'price') {
         setFilterPrice(prev => prev.filter(p => p !== value));
      }
      if (type === 'skincare') {
         setFilterSkincare(prev => prev.filter(s => s !== value));
      }
      if (type === 'use') {
         setFilterUse(prev => prev.filter(u => u !== value));
      }
      if (type === 'type') {
         setFilterType(prev => prev.filter(t => t !== value));
      }
      if (type === 'style') {
         setFilterStyle(prev => prev.filter(st => st !== value));
      }
   };

   const togglePrice = (price: number) => {
      setFilterPrice(prev => (prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]));
   };

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
               {/* <Button
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
               </Button> */}
            </Box>
            <Box display={'flex'} gap={'16px'} fontSize={'12px'} alignItems={'center'} color={'rgba(0,0,0,0.4)'}>
               <Text>총 {categoryItems.length}개</Text>
               <NativeSelect.Root size={'xs'} w={'90px'} variant={'plain'}>
                  <NativeSelect.Field
                     padding={'2px 4px'}
                     h={'24px'}
                     color={'rgba(0,0,0,0.4)'}
                     value={sortOrder}
                     onChange={e => setSortOrder(e.target.value)}
                  >
                     <option value="낮은 가격 순">낮은 가격 순</option>
                     <option value="높은 가격 순">높은 가격 순</option>
                  </NativeSelect.Field>
                  <NativeSelectIndicator />
               </NativeSelect.Root>
            </Box>
         </Box>
         <Dialog.Root placement={'center'} open={open} onOpenChange={isOpen => !isOpen && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
               <Dialog.Content bg="white" color="black">
                  <Dialog.CloseTrigger />
                  <Dialog.Header>
                     <Dialog.Title>필터</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                     <Flex
                        mb={'16px'}
                        justifyContent={'space-between'}
                        bgColor={'rgba(204,204,204,0.3)'}
                        gap={4}
                        p={1}
                        flex={1}
                     >
                        <Flex>
                           {filterBoth && (
                              <Tag.Root
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>남녀 무관</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('gender', 'both');
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           )}
                           {filterMale && (
                              <Tag.Root
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>남성</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('gender', 'male');
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           )}
                           {filterFemale && (
                              <Tag.Root
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>여성</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('gender', 'female');
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           )}
                           {filterPrice.map(price => (
                              <Tag.Root
                                 key={`price-${price}`}
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>{priceLabels[price]}</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('price', price);
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           ))}
                           {filterSkincare.map(item => (
                              <Tag.Root
                                 key={`skincare-${item}`}
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>{item}</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('skincare', item);
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           ))}
                           {filterUse.map(item => (
                              <Tag.Root
                                 key={`use-${item}`}
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>{item}</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('use', item);
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           ))}
                           {filterType.map(item => (
                              <Tag.Root
                                 key={`type-${item}`}
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>{item}</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('type', item);
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           ))}
                           {filterStyle.map(item => (
                              <Tag.Root
                                 key={`style-${item}`}
                                 size={'sm'}
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 justifyContent={'space-between'}
                                 m={1}
                              >
                                 <Tag.Label>{item}</Tag.Label>
                                 <Tag.EndElement>
                                    <Tag.CloseTrigger
                                       onClick={() => {
                                          removeFilterTag('style', item);
                                       }}
                                    />
                                 </Tag.EndElement>
                              </Tag.Root>
                           ))}
                        </Flex>
                        <IconButton
                           size={'xs'}
                           variant={'ghost'}
                           onClick={handleReset}
                           color={'black'}
                           _hover={{ color: 'white' }}
                           aria-label="필터 초기화"
                        >
                           <RiResetLeftFill />
                        </IconButton>
                     </Flex>
                     <Flex flexDirection={'column'} gap={'16px'} alignItems={'flex-start'}>
                        <Flex direction={'column'} gap={'8px'} w={'full'}>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              성별
                           </Text>
                           <HStack>
                              <Checkbox.Root
                                 variant={'solid'}
                                 colorPalette={'red'}
                                 w={'full'}
                                 checked={filterBoth}
                                 onCheckedChange={e => {
                                    setFilterBoth(!!e.checked);
                                    if (e.checked) {
                                       setFilterMale(false);
                                       setFilterFemale(false);
                                    }
                                 }}
                              >
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label>남녀 무관</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root
                                 variant={'solid'}
                                 w={'full'}
                                 colorPalette={'red'}
                                 checked={filterMale}
                                 onCheckedChange={e => {
                                    setFilterMale(!!e.checked);
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
                                 w={'full'}
                                 checked={filterFemale}
                                 onCheckedChange={e => {
                                    setFilterFemale(!!e.checked);
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
                        <Flex direction={'column'} gap={'8px'} w={'full'}>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              가격
                           </Text>
                           <HStack>
                              <Checkbox.Root
                                 w={'full'}
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
                                 w={'full'}
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
                                 w={'full'}
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
                           <Segment
                              skincare={filterSkincare}
                              use={filterUse}
                              type={filterType}
                              style={filterStyle}
                              setSkincare={setFilterSkincare}
                              setUse={setFilterUse}
                              setType={setFilterType}
                              setStyle={setFilterStyle}
                           />
                        </Flex>
                     </Flex>
                  </Dialog.Body>
                  <Dialog.Footer>
                     <Button
                        onClick={() => {
                           handleSaveDialog();
                           setDialog(false);
                           //  setDialog(prev => !prev);
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
                           setDialog(false);
                           onClose();
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

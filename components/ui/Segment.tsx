import { Box, Checkbox, Flex, HStack, Tabs, VStack } from '@chakra-ui/react';
import items from '@/data/items.json';
import { useState } from 'react';

export default function Segment() {
   // ---상세옵션 ---
   //skincare
   const [hydration, setHydration] = useState(null);
   const [sooth_Moisturizing, setSooth_Moisturizing] = useState(null);
   const [trouble, setTrouble] = useState(null);
   const [exfoliating, setexfoliating] = useState(null);
   const [brightening, setBrightening] = useState(null);
   const [antiaging, setAntiaging] = useState(null);
//use
const [entire, setEntire] = useState(null)
const [face, setFace] = useState(null)

   const detailedData = () => {
      let checked = items;

      if (skincare || use || type || style) {
         if (skincare) {
         } else if (filterMale && filterFemale) {
            checked = checked.filter(item => item.gender === '남성' || item.gender === '여성');
         } else if (filterMale) {
            checked = checked.filter(item => item.gender === '남성');
         } else if (filterFemale) {
            checked = checked.filter(item => item.gender === '여성');
         }
      }

      if (filterPrice.length > 0) {
         checked = checked.filter(item => filterPrice.some(price => item.price <= price));
      }
      return checked.length;
   };
   return (
      <Box>
         <Tabs.Root defaultValue={'skincare'} variant={'enclosed'} w={'100%'}>
            <Tabs.List bg={'rgba(204,204,204,0.16)'} rounded={'4'} w={'100%'}>
               <Tabs.Trigger value="skincare" w={'100%'}>
                  스킨케어
               </Tabs.Trigger>
               <Tabs.Trigger value="use" w={'100%'}>
                  사용범위
               </Tabs.Trigger>
               <Tabs.Trigger value="type" w={'100%'}>
                  피부타입
               </Tabs.Trigger>
               <Tabs.Trigger value="style" w={'100%'}>
                  제형
               </Tabs.Trigger>
            </Tabs.List>
            <Box h={'100px'}>
               <Tabs.Content value="skincare" w={'100%'}>
                  <VStack w={'100%'}>
                     <HStack alignItems={'flex-start'} w={'100%'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              진정/보습
                           </Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              트러블케어
                           </Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              수분공급
                           </Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>각질케어</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>브라이트닝</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>안티에이징</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                  </VStack>
               </Tabs.Content>
               <Tabs.Content value="use" w={'100%'}>
                  <VStack w={'100%'}>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>온몸</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>얼굴</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>입술</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'226px'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>눈</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>바디</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                  </VStack>
               </Tabs.Content>
               <Tabs.Content value="type">
                  <VStack w={'100%'}>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>건성</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>지성</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>복합성</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>민감성</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                  </VStack>
               </Tabs.Content>
               <Tabs.Content value="style">
                  <VStack w={'100%'}>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>젤</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>크림</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>로션</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'226px'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>리퀴드</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root variant={'solid'} colorPalette={'red'} w={'100%'}>
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>밤</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                  </VStack>
               </Tabs.Content>
            </Box>
         </Tabs.Root>
      </Box>
   );
}

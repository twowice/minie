import { Box, Checkbox, HStack, Tabs, VStack } from '@chakra-ui/react';

export default function Segment({ skincare, use, type, style, setSkincare, setUse, setType, setStyle }) {
   const checkSkincare = value => {
      setSkincare(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
   };
   const checkUse = value => {
      setUse(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
   };
   const checkType = value => {
      setType(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
   };
   const checkStyle = value => {
      setStyle(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
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
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('진정/보습')}
                           onCheckedChange={() => checkSkincare('진정/보습')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              진정/보습
                           </Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('트러블케어')}
                           onCheckedChange={() => checkSkincare('트러블케어')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              트러블케어
                           </Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('수분공급')}
                           onCheckedChange={() => checkSkincare('수분공급')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'} w={'100%'}>
                              수분공급
                           </Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('각질케어')}
                           onCheckedChange={() => checkSkincare('각질케어')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>각질케어</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('브라이트닝')}
                           onCheckedChange={() => checkSkincare('브라이트닝')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>브라이트닝</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={skincare.includes('안티에이징')}
                           onCheckedChange={() => checkSkincare('안티에이징')}
                        >
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
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={use.includes('온몸')}
                           onCheckedChange={() => checkUse('온몸')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>온몸</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={use.includes('얼굴')}
                           onCheckedChange={() => checkUse('얼굴')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>얼굴</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={use.includes('입술')}
                           onCheckedChange={() => checkUse('입술')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>입술</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'226px'}
                           checked={use.includes('눈')}
                           onCheckedChange={() => checkUse('눈')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>눈</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={use.includes('바디')}
                           onCheckedChange={() => checkUse('바디')}
                        >
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
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={type.includes('건성')}
                           onCheckedChange={() => checkType('건성')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>건성</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={type.includes('지성')}
                           onCheckedChange={() => checkType('지성')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>지성</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={type.includes('복합성')}
                           onCheckedChange={() => checkType('복합성')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>복합성</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={type.includes('민감성')}
                           onCheckedChange={() => checkType('민감성')}
                        >
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
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('젤')}
                           onCheckedChange={() => checkStyle('젤')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>젤</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('크림')}
                           onCheckedChange={() => checkStyle('크림')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>크림</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('로션')}
                           onCheckedChange={() => checkStyle('로션')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>로션</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                     <HStack w={'100%'} alignItems={'flex-start'}>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('리퀴드')}
                           onCheckedChange={() => checkStyle('리퀴드')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>리퀴드</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('밤')}
                           onCheckedChange={() => checkStyle('밤')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>밤</Checkbox.Label>
                        </Checkbox.Root>
                        <Checkbox.Root
                           variant={'solid'}
                           colorPalette={'red'}
                           w={'100%'}
                           checked={style.includes('기타')}
                           onCheckedChange={() => checkStyle('기타')}
                        >
                           <Checkbox.HiddenInput />
                           <Checkbox.Control />
                           <Checkbox.Label color={'black'}>기타</Checkbox.Label>
                        </Checkbox.Root>
                     </HStack>
                  </VStack>
               </Tabs.Content>
            </Box>
         </Tabs.Root>
      </Box>
   );
}

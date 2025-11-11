import { Box, Checkbox, Flex, Tabs, VStack } from '@chakra-ui/react';

export default function Segment() {
   return (
      <Box>
         <Tabs.Root defaultValue={'skincare'} variant={'enclosed'} w={'100%'}>
            <Tabs.List bg={'rgba(204,204,204,0.16)'} rounded={'4'} p={'1'} w={'100%'}>
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
            <Tabs.Content value="skincare">
               <Flex>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>진정/보습</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>트러블케어</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>각질케어</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>각질케어</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>브라이트닝</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>안티에이징</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
               </Flex>
            </Tabs.Content>
            <Tabs.Content value="use">
               <Flex>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} _checked={{ background: "red" }}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>온몸</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>얼굴</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>입술</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>눈</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>바디</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
               </Flex>
            </Tabs.Content>
            <Tabs.Content value="type">
               <Flex>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>건성</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>지성</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>복합성</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>민감성</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
               </Flex>
            </Tabs.Content>
            <Tabs.Content value="style">
               <Flex>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>젤</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>크림</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>로션</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
                  <VStack w={'100%'} alignItems={'flex-start'}>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>리퀴드</Checkbox.Label>
                     </Checkbox.Root>
                     <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={'black'}>밤</Checkbox.Label>
                     </Checkbox.Root>
                  </VStack>
               </Flex>
            </Tabs.Content>
         </Tabs.Root>
      </Box>
   );
}

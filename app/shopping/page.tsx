'use client';

import ShoppingItem from '@/components/ShoppingItem';
import Segment from '@/components/ui/Segment';
import {
   Box,
   Button,
   Checkbox,
   CloseButton,
   Container,
   Dialog,
   Flex,
   HStack,
   NativeSelect,
   NativeSelectIndicator,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import { MdFilterListAlt } from 'react-icons/md';

export default function Shopping() {
   const { open, onOpen, onClose } = useDisclosure();

   return (
      <Container maxW={'7xl'}>
         <Flex mb={2} direction={{ base: 'column', md: 'row' }} flexDirection={'column'}>
            <Box display={'flex'} justifyContent={'space-between'} backgroundColor={'rgba(204,204,204,0.16)'} p={'8px'}>
               <Box display={'flex'} gap={'10px'}>
                  <Button
                     color={'rgba(0,0,0,0.16)'}
                     borderRadius={'2px'}
                     w={'24px'}
                     h={'24px'}
                     display={'flex'}
                     justifyContent={'center'}
                     alignItems={'center'}
                     border={'1px solid rgba(0,0,0,0.16)'}
                     onClick={onOpen} //Dialog 트리거
                  >
                     <MdFilterListAlt />
                  </Button>
                  <Button
                     color={'rgba(0,0,0,0.16)'}
                     borderRadius={'2px'}
                     w={'24px'}
                     h={'24px'}
                     border={'1px solid rgba(0,0,0,0.16)'}
                     fontSize={'12px'}
                     textAlign={'center'}
                  >
                     남
                  </Button>
                  <Button
                     color={'rgba(0,0,0,0.16)'}
                     borderRadius={'2px'}
                     border={'1px solid rgba(0,0,0,0.16)'}
                     w={'24px'}
                     h={'24px'}
                     fontSize={'12px'}
                     textAlign={'center'}
                  >
                     여
                  </Button>
                  <Button
                     color={'rgba(0,0,0,0.16)'}
                     border={'1px solid rgba(0,0,0,0.16)'}
                     borderRadius={'2px'}
                     h={'24px'}
                     fontSize={'12px'}
                     textAlign={'center'}
                     p={'0 4px'}
                  >
                     마이타입
                  </Button>
               </Box>
               <Box display={'flex'} gap={'16px'} fontSize={'12px'} alignItems={'center'} color={'rgba(0,0,0,0.4)'}>
                  <Text>총 ${}개</Text>
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
            <ShoppingItem />
         </Flex>
         <Dialog.Root placement={'center'} open={open} onClose={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
               <Dialog.Content>
                  <Dialog.CloseTrigger />
                  <Dialog.Header>
                     <Dialog.Title>필터</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                     <Flex flexDirection={'column'} gap={'16px'} alignItems={'flex-start'}>
                        <Box>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              성별
                           </Text>
                           <HStack>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>남녀무관</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>남성</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>여성</Checkbox.Label>
                              </Checkbox.Root>
                           </HStack>
                        </Box>
                        <Box>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              가격
                           </Text>
                           <HStack>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>10,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>15,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                              <Checkbox.Root variant={'solid'} colorPalette={'red'}>
                                 <Checkbox.HiddenInput />
                                 <Checkbox.Control />
                                 <Checkbox.Label color={'white'}>20,000원 이하</Checkbox.Label>
                              </Checkbox.Root>
                           </HStack>
                        </Box>
                        <Box>
                           <Text fontWeight={'500'} fontSize={'16px'}>
                              상세옵션
                           </Text>
                           <Segment />
                        </Box>
                     </Flex>
                  </Dialog.Body>
                  <Dialog.Footer>
                     <Button onClick={onClose}>{}개의 상품 보러가기</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                     <CloseButton size={'sm'} onClick={onClose} />
                  </Dialog.CloseTrigger>
               </Dialog.Content>
            </Dialog.Positioner>
         </Dialog.Root>
      </Container>
   );
}

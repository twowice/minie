import { Box, Checkbox, Flex, IconButton, Image } from '@chakra-ui/react';
import { CartItem } from '@/app/api/cart/cart';

import HeartFilledIcon from './ui/HeartIcon';
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';
import { numberFormatter } from '../utils/formatter/numberFomatter';
import { getDiscountRate } from '@/utils/calculator/discountRateCalculator';
import { MdClose } from 'react-icons/md';

/* useCart()를 통해 커스텀 Context에 든 데이터 및 함수를 이용하셔야 합니다.
 */

export default function ShoppingCartItem({
   item,
   isLiked,
   handleChecked,
   handleNumChanged,
   handleCartDelete,
   handleLike,
}: {
   item: CartItem;
   isLiked: boolean;
   handleChecked: () => void;

   handleNumChanged: (type?: string) => void;
   handleCartDelete: () => void;
   handleLike: (type?: string) => void;
}) {
   return (
      <Box
         background={'white'}
         mx={'40px'}
         display={'flex'}
         flexDirection={'row'}
         alignItems={'center'}
         gap={'16px'}
         color={'black'}
         borderBottom={'1px solid #CCCCCC'}
         px={0}
         py={'10px'}
         h={'161px'}
      >
         <Checkbox.Root
            variant={'outline'}
            checked={item.checked}
            onCheckedChange={handleChecked}
            alignItems={'center'}
            colorPalette={'red'}
         >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
         </Checkbox.Root>
         <Image src={item.image} w={'130px'} h={'130px'} fit={'contain'} />
         <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} minH={'130px'}>
            <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'start'}>
               <Box>
                  <Box fontWeight={'medium'}>{item.title}</Box>
                  <Box color={'#808080'}>{item.brand}</Box>
               </Box>
               <IconButton onClick={handleCartDelete} bgColor={'transparent'} color={'black'}>
                  <MdClose />
               </IconButton>
            </Box>
            <Flex flex={1} flexDirection={'column'}>
               <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'end'} gap={'4px'}>
                  <IconButton
                     color={item.num === 1 ? '#CCCCCC' : ''}
                     onClick={() => handleNumChanged('minus')}
                     disabled={item.num === 1}
                     bgColor={'transparent'}
                  >
                     <AiFillMinusCircle />
                  </IconButton>
                  <Box fontWeight={'medium'} fontSize={'16px'}>
                     {item.num}
                  </Box>
                  <IconButton onClick={() => handleNumChanged('plus')} bgColor={'transparent'} color={'black'}>
                     <AiFillPlusCircle />
                  </IconButton>
               </Box>
               <Box
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'end'}
                  gap={'4px'}
                  visibility={item.isDiscounted ? 'visible' : 'hidden'}
               >
                  <Box fontWeight={'medium'} color={'#FA6D6D'} fontSize={'12px'}>
                     {getDiscountRate(item.price, item.discountAmount)}%
                  </Box>
                  <Box fontSize={'12px'} textDecoration={'line-through'} color={'#808080'}>
                     {numberFormatter.format(item.price * item.num)}
                  </Box>
                  <Box fontSize={'12px'} color={'#808080'}>
                     원
                  </Box>
               </Box>
               <Box>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                     <IconButton
                        onClick={() => {
                           isLiked ? handleLike('unlike') : handleLike('like');
                        }}
                        bgColor={'transparent'}
                     >
                        <HeartFilledIcon
                           filledColor={isLiked ? '#FA6D6D' : 'none'}
                           strokeColor={isLiked ? '#FA6D6D' : '#CCCCCC'}
                        />
                     </IconButton>
                     <Box display={'flex'} gap={'2px'}>
                        <Box fontSize={'16px'} fontWeight={'semibold'}>
                           {numberFormatter.format((item.price - item.discountAmount) * item.num)}
                        </Box>
                        <Box fontSize={'16px'} fontWeight={'medium'}>
                           원
                        </Box>
                     </Box>
                  </Box>
               </Box>
            </Flex>
         </Box>
      </Box>
   );
}

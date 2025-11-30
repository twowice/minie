import { AspectRatio, Box, Flex, Skeleton, VStack } from '@chakra-ui/react';

export const ShoppingItemSkeleton = () => {
   return (
      <VStack
         minW={0}
         overflow={'hidden'}
         h={'100%'}
         bg={'white'}
         borderRadius={'lg'}
         boxShadow={'sm'}
         gap={0}
         justifyContent={'space-between'}
      >
         <AspectRatio ratio={1} w={'100%'}>
            <Skeleton w={'100%'} h={'100%'} />
         </AspectRatio>
         <Box p={4} w={'100%'} h={'100%'}>
            <Flex justifyContent={'space-between'} alignItems={'center'} mb={1}>
               <Skeleton h={'30px'} w={'50%'} borderRadius={'4px'} />
               <Skeleton h={'30px'} w={'40%'} borderRadius={'4px'} />
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'center'} mb={'8px'}>
               <Skeleton h={'24px'} w={'40%'} borderRadius={'4px'} />
               <Skeleton h={'24px'} w={'30%'} borderRadius={'full'} />
            </Flex>
            <Skeleton h={'40px'} w={'100%'} borderRadius={'4px'} mb={2} />
         </Box>
      </VStack>
   );
};

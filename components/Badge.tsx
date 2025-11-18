import { HStack, Badge, Text } from '@chakra-ui/react';
import { getBadgeConfig } from '@/config/Types';

export const TypeBadge = ({ typeName }) => {
   const key = getBadgeConfig(typeName);
   if (!key) return null;

   return (
      <Badge
         bgColor={key.bgColor}
         color={key.color}
         border="1px solid rgba(255,255,255,0.3)"
         fontSize="16px"
         fontWeight="normal"
         borderRadius={'20px'}
         p={'4px'}
         w={'100px'}
         display={'flex'}
         justifyContent={'center'}
      >
         <HStack>
            <Text>{key.displayName}</Text>
         </HStack>
      </Badge>
   );
};

export default TypeBadge;

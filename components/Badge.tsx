import { HStack, Badge, Text } from '@chakra-ui/react';
import {getTypeConfig} from '@/config/Types'

export const TypeBadge = ({ typeName }) => {
   const typeConfig = getTypeConfig(typeName) ?? {
  bgColor: 'red',
  color: 'white',
  displayName: typeName ?? 'Unknown',
};
   return (
      <Badge
         bgColor={typeConfig.bgColor}
         color={typeConfig.color}
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
            <Text>{typeConfig.displayName}</Text>
         </HStack>
      </Badge>
   
   );
   
};

export default TypeBadge;
import { CartItem } from "@/app/api/cart/cart";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { Box, Image, HStack } from "@chakra-ui/react";

export default function PaymentCartItem({
  item,
  isLast,
}: {
  item: CartItem;
  isLast: boolean;
}) {
  return (
    <HStack
      borderBottom={isLast ? "2px solid #C6C6C6" : "1px solid #C6C6C6"}
      h={"130px"}
      gap={0}
      alignItems={"center"}
      px={"10px"}
    >
      <HStack flex={2}>
        <Image
          src={item.image}
          fit="contain"
          h={"120px"}
          w={"120px"}
          mx={"20px"}
        />
        <Box>
          <Box fontSize={"14px"} fontWeight={"medium"}>
            {item.title}
          </Box>
          <Box fontSize={"14px"} fontWeight={"medium"} color={"#808080"}>
            {item.brand}
          </Box>
        </Box>
      </HStack>
      <HStack flex={1} textAlign={"center"}>
        <Box flex={1} fontWeight={"medium"} fontSize={"14px"}>
          {numberFormatter.format(item.price)} 원
        </Box>
        <Box flex={1} fontWeight={"medium"} fontSize={"14px"}>
          {item.num}
        </Box>
        {item.isDiscounted ? (
          <Box flex={1} flexDirection={"column"}>
            <HStack justifyContent={"center"} gap={"2px"}>
              <Box
                fontSize={"14px"}
                textDecoration={"line-through"}
                color={"#808080"}
              >
                {numberFormatter.format(item.price * item.num)}
              </Box>
              <Box fontSize={"14px"} color={"#808080"}>
                원
              </Box>
            </HStack>
            <Box fontSize={"16px"} color={"#FA6D6D"} fontWeight={"semibold"}>
              {numberFormatter.format(
                (item.price - item.discountAmount) * item.num
              )}{" "}
              원
            </Box>
          </Box>
        ) : (
          <Box flex={1} fontSize={"16px"} fontWeight={"medium"}>
            {numberFormatter.format(item.price * item.num)} 원
          </Box>
        )}
      </HStack>
    </HStack>
  );
}

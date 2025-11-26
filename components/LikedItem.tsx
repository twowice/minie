import { Box, Checkbox, Flex, IconButton, Image } from "@chakra-ui/react";
import { CartItem } from "@/app/api/cart/cart";

import HeartFilledIcon from "./ui/HeartIcon";
import { numberFormatter } from "../utils/formatter/numberFomatter";
import { getDiscountRate } from "@/utils/calculator/discountRateCalculator";

/* useCart()를 통해 커스텀 Context에 든 데이터 및 함수를 이용하셔야 합니다.
 */

export default function LikedItem({
  item,
  cartHas,
  handleChecked,
  handleLike,
}: {
  item: CartItem;
  cartHas: boolean;
  handleChecked: () => void;
  handleLike: (type?: string) => void;
}) {
  return (
    <Box
      background={"white"}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
      color={"black"}
      borderBottom={"1px solid #CCCCCC"}
      py={"10px"}
      mx={"40px"}
      px={0}
      h={"152px"}
    >
      <Checkbox.Root
        variant={"outline"}
        checked={item.checked}
        onCheckedChange={handleChecked}
        alignItems={"center"}
        colorPalette={"red"}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
      <Image src={item.image} w={"130px"} h={"130px"} fit={"contain"} />
      <Flex
        flex={1}
        flexDirection={"column"}
        justifyContent={"space-between"}
        h={"100%"}
      >
        <Box
          display={"flex"}
          flex={1}
          justifyContent={"space-between"}
          alignItems={"start"}
        >
          <Box>
            <Box fontWeight={"medium"}>{item.title}</Box>
            <Box color={"#808080"}>{item.brand}</Box>
          </Box>
        </Box>
        {cartHas && (
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            fontSize={"12px"}
            fontWeight={"medium"}
          >
            장바구니에 담긴 상품
          </Box>
        )}
        {item.isDiscounted && (
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"end"}
            gap={"4px"}
          >
            <Box fontWeight={"medium"} color={"#FA6D6D"} fontSize={"12px"}>
              {getDiscountRate(item.price, item.discountAmount)}%
            </Box>
            <Box
              fontSize={"12px"}
              textDecoration={"line-through"}
              color={"#808080"}
            >
              {item.price}
            </Box>
            <Box fontSize={"12px"} color={"#808080"}>
              원
            </Box>
          </Box>
        )}
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              bg={"transparent"}
              onClick={() => {
                handleLike("unlike");
              }}
            >
              <HeartFilledIcon
                filledColor={"#FA6D6D"}
                strokeColor={"#FA6D6D"}
              />
            </IconButton>
            <Box display={"flex"} gap={"2px"}>
              <Box fontSize={"16px"} fontWeight={"semibold"}>
                {numberFormatter.format(item.price - item.discountAmount)}
              </Box>
              <Box fontSize={"16px"} fontWeight={"medium"}>
                원
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

import { Box, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { CartItemProps } from "./ShoppingCartDrawer";
import HeartFilledIcon from "./ui/HeartIcon";
import { numberFormatter } from "../utils/formatter/numberFomatter";
import { getDiscountRate } from "@/utils/calculator/discountRateCalculator";

export default function LikedItem({
  item,
  cartHas,
  handleChecked,
  handleLike,
}: {
  item: CartItemProps;
  cartHas: boolean;
  handleChecked: () => void;
  handleLike: (type?: string) => void;
}) {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
      color={"black"}
      borderBottom={"1px solid #CCCCCC"}
      py={"10px"}
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
      <Image src={item.image} w={130} h={130}></Image>
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box
          display={"flex"}
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
              {getDiscountRate(item.price, item.discountMount)}%
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
                {numberFormatter.format(item.price - item.discountMount)}
              </Box>
              <Box fontSize={"16px"} fontWeight={"medium"}>
                원
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

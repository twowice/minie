import { Box, Checkbox, Flex, IconButton, Image } from "@chakra-ui/react";
import { CartItem } from "@/app/api/cart/cart";

import HeartFilledIcon from "./ui/HeartIcon";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { numberFormatter } from "../utils/formatter/numberFomatter";
import { getDiscountRate } from "@/utils/calculator/discountRateCalculator";
import { MdClose } from "react-icons/md";

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
      background={"white"}
      mx={"40px"}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
      color={"black"}
      borderBottom={"1px solid #CCCCCC"}
      py={"10px"}
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
        <Flex flex={1} justifyContent={"space-between"} alignItems={"start"}>
          <Box>
            <Box fontWeight={"medium"}>{item.title}</Box>
            <Box color={"#808080"}>{item.brand}</Box>
          </Box>
          <IconButton onClick={handleCartDelete} bg={"white"}>
            <MdClose color={"black"} />
          </IconButton>
        </Flex>
        <Flex gap={0} flex={1} flexDirection={"column"}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"end"}
            gap={"4px"}
          >
            <IconButton
              color={item.num === 1 ? "#CCCCCC" : ""}
              onClick={() => handleNumChanged("minus")}
              disabled={item.num === 1}
              bg={"white"}
            >
              <AiFillMinusCircle />
            </IconButton>
            <Box fontWeight={"medium"} fontSize={"16px"}>
              {item.num}
            </Box>
            <IconButton
              bg={"transparent"}
              onClick={() => handleNumChanged("plus")}
            >
              <AiFillPlusCircle color="black" />
            </IconButton>
          </Box>
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
                {numberFormatter.format(item.price * item.num)}
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
                bg={"white"}
                onClick={() => {
                  isLiked ? handleLike("unlike") : handleLike("like");
                }}
              >
                <HeartFilledIcon
                  filledColor={isLiked ? "#FA6D6D" : "none"}
                  strokeColor={isLiked ? "#FA6D6D" : "#A6A6A6"}
                />
              </IconButton>
              <Box display={"flex"} gap={"2px"}>
                <Box fontSize={"16px"} fontWeight={"semibold"}>
                  {numberFormatter.format(
                    (item.price - item.discountAmount) * item.num
                  )}
                </Box>
                <Box fontSize={"16px"} fontWeight={"medium"}>
                  원
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

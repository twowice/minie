"use client";

import { Box, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { CartItemProps } from "./ShoppingCartDrawer";
import HeartFilledIcon from "./ui/HeartIcon";
import { useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { numberFormatter } from "../utils/formatter/numberFomatter";
import { getDiscountRate } from "@/utils/calculator/discountRateCalculator";
import { MdClose } from "react-icons/md";

/* 
TODO: 기록할 것
ShoppingCartDrawer에서 기본적으로 인자에 건네주는 함수

  
  
*/

export default function ShoppingCartItem({
  item,
  isLiked,
  handleCartChecked,
  handleNumChanged,
  handleCartDelete,
}: {
  item: CartItemProps;
  isLiked: boolean;
  handleCartChecked: () => void;
  handleNumChanged: (type?: string) => void;
  handleCartDelete: () => void;
}) {
  const [like, setLike] = useState(isLiked);

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
        onCheckedChange={handleCartChecked}
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
          <IconButton onClick={handleCartDelete}>
            <MdClose />
          </IconButton>
        </Box>
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
          >
            <AiFillMinusCircle />
          </IconButton>
          <Box fontWeight={"medium"} fontSize={"16px"}>
            {item.num}
          </Box>
          <IconButton onClick={() => handleNumChanged("plus")}>
            <AiFillPlusCircle />
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
              {getDiscountRate(item.price, item.discountMount)}%
            </Box>
            <Box
              fontSize={"12px"}
              textDecoration={"line-through"}
              color={"#808080"}
            >
              {item.price * item.num}
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
                setLike((prev) => !prev);
              }}
            >
              <HeartFilledIcon
                filledColor={like ? "#FA6D6D" : "none"}
                strokeColor={like ? "#FA6D6D" : "#CCCCCC"}
              />
            </IconButton>
            <Box display={"flex"} gap={"2px"}>
              <Box fontSize={"16px"} fontWeight={"semibold"}>
                {numberFormatter.format(
                  (item.price - item.discountMount) * item.num
                )}
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

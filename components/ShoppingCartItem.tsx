"use client";

import { Box, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { ShoppingCartProps } from "./ShoppingCartDrawer";
import HeartFilledIcon from "./ui/HeartIcon";
import { useState } from "react";

export default function ShoppingCartItem({
  item,
  handleToggleChecked,
}: {
  item: ShoppingCartProps;
  handleToggleChecked: () => void;
}) {
  const [like, setLike] = useState(false);

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
    >
      <Checkbox.Root
        variant={"outline"}
        color={item.checked ? "#FA6D6D" : "black"}
        checked={item.checked}
        onCheckedChange={handleToggleChecked}
        alignItems={"center"}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
      <Image src={item.image} w={130} h={130}></Image>
      <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
        <Box>
          <Box>{item.title}</Box>
          <Box>{item.brand}</Box>
        </Box>
        <Box>
          <Box display={"flex"} alignItems={"center"}>
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
            <Box>{item.price * item.num} 원</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

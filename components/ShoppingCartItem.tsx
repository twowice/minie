"use client";

import { Box, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { ShoppingCartProps } from "./ShoppingCartDrawer";
import HeartFilledIcon from "./ui/HeartIcon";
import { useState } from "react";

export default function ShoppingCartItem({
  item,
  handleToggleChecked,
  allChecked,
}: {
  item: ShoppingCartProps;
  handleToggleChecked: () => void;
  allChecked: boolean;
}) {
  const [like, setLike] = useState(false);

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
      color={"black"}
    >
      <Checkbox.Root
        variant={"outline"}
        checked={item.checked || allChecked}
        onCheckedChange={handleToggleChecked}
        alignItems={"center"}
        _checked={{
          borderColor: "#FA6D6D",
          "& .chakra-checkbox__control[data-checked] svg": {
            color: "#FA6D6D",
          },
        }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
      <Image src={item.image} w={130} h={130}></Image>
      <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
        <Box>
          <Box fontWeight={"medium"}>{item.title}</Box>
          <Box>{item.brand}</Box>
        </Box>
        <Box>
          <Box>{item.num}</Box>
        </Box>
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
            <Box fontSize={"16px"} fontWeight={"semibold"}>
              {item.price * item.num} 원
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

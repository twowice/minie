import { Box, Checkbox, Image } from "@chakra-ui/react";
import { ShoppingCartProps } from "./ShoppingCartDrawer";

export default function ShoppingCartItem({
  item,
  handleToggleChecked,
}: {
  item: ShoppingCartProps;
  handleToggleChecked: () => void;
}) {
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
          <Box>
            <Box>{item.price * item.num} 원</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, Circle, Float, IconButton } from "@chakra-ui/react";
import { CartIcon } from "./CartIcon";
import { Dispatch, SetStateAction } from "react";

export default function ShoppingCartIconButton({
  cartItemsLength,
  isCartActivity,
  setIsCartActivity,
}: {
  cartItemsLength: number;
  isCartActivity: boolean;
  setIsCartActivity: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <IconButton
      aria-label="장바구니"
      cursor="pointer"
      position={"relative"}
      bg={"white"}
      onClick={() => {
        setIsCartActivity((prev) => !prev);
      }}
    >
      <Box
        position="relative"
        display="inline-block"
        w={{ base: 5, md: 6 }}
        h={{ base: 5, md: 6 }}
      >
        <CartIcon
          w="100%"
          h="100%"
          color={isCartActivity ? "#FA6D6D" : "black"}
        />

        {cartItemsLength !== 0 && (
          <Float placement={"top-end"} offset={[0, 0.5]}>
            <Circle size="3" bg="red" color="white" fontSize="11px">
              {cartItemsLength}
            </Circle>
          </Float>
        )}
      </Box>
    </IconButton>
  );
}

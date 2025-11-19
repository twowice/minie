"use client";
import { Button, Text, Box, Checkbox, Tabs } from "@chakra-ui/react";
import { useCart } from "@/contexts/ShoppingCartContext";
import ShoppingCartItem from "../../../components/ShoppingCartItem";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
export default function Page() {
  const {
    cartItems,
    toggleChecked,
    toggleAllChecked,
    updateQuantity,
    removeItem,
    clear,
    toggleLike,
    isLiked,
  } = useCart();

  // 계산 로직들은 Context에서 가져온 상태를 기반으로 수행
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item.checked ? (item.price - item.discountAmount) * item.num : 0),
    0
  );

  const isAllCartChecked =
    cartItems.length > 0 && cartItems.every((item) => item.checked);

  return (
    <>
      <Text color="#000000" fontWeight="bold" fontSize="28px" height="40px">장바구니</Text>
      <Box
        display="flex"
        flexDirection="row"
        w="100%"
        h="20px"
        gap="10px"
        alignItems="center"
        px="15px"
        mt="20px"
      >
        <Checkbox.Root
          w="20px"
          variant={"outline"}
          colorPalette={"red"}
          checked={isAllCartChecked}
          onCheckedChange={() =>
            toggleAllChecked("cart")
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>

        <Box color="#CCCCCC">|</Box>

        <Box
          display="flex"
          flex={1}
          justifyContent="left"
          color="black"
          fontWeight="bold"
        >
          상품 정보
        </Box>

        <Text
          cursor="pointer"
          color={"black"}
          bg={"white"}
          fontWeight={"medium"}
          onClick={() => clear("cart")}
        >
          전체 삭제
        </Text>
      </Box>
      <Box flex="1" overflowY="auto" height="calc(100vh - 200px)" paddingBottom="80px">
        <Tabs.Root value="cart">
          <Tabs.Content value="cart" style={{ height: "100%" }}>
            {cartItems.length === 0 && (
              <Box color={"black"} px={"40px"}>
                장바구니에 담긴 상품이 없습니다.
              </Box>
            )}
            {cartItems.map((item) => (
              <ShoppingCartItem
                key={item.id}
                item={item}
                isLiked={isLiked(item.id)}
                handleChecked={() => toggleChecked(item.id, "cart")}
                handleNumChanged={(type) =>
                  updateQuantity(item.id, type as "plus" | "minus")
                }
                handleCartDelete={() => removeItem(item.id)}
                handleLike={() => toggleLike(item)}
              />
            ))}
          </Tabs.Content>
        </Tabs.Root>

        <Box
          display="flex"
          justifyContent="flex-end"
          px="15px"
          py="10px"
          position="sticky"
          bottom="0"
          bg="white"
          zIndex={10}
        >
          <Button
             _hover={{
              bg: "#e55b5b",
              transform: "scale(1.03)",
              transition: "all 0.2s ease-in-out",
            }}
            w="300px"
            h="40px"
            color={"white"}
            bg={"#FA6D6D"}
            fontWeight={"medium"}
            marginTop="10px"
          >
            {numberFormatter.format(totalPrice)}원 구매하기
          </Button>
        </Box>
      </Box>
    </>
  );
}

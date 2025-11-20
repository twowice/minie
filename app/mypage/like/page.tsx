"use client";
import { Button, Text, Box, Checkbox, Tabs } from "@chakra-ui/react";
import { useMemo } from "react";
import { useCart } from "@/contexts/ShoppingCartContext";
import LikedItem from "../../../components/LikedItem";
export default function Page() {
  const {
    cartItems,
    likedItems,
    toggleChecked,
    toggleAllChecked,
    clear,
    toggleLike,
    addLikedItemsToCart,
  } = useCart();

  // 계산 로직들은 Context에서 가져온 상태를 기반으로 수행
  const cartItemsIdsAllSet = useMemo(
    () => new Set(cartItems.map((item) => item.id)),
    [cartItems]
  );

  const isAllLikedItemChecked =
    likedItems.length > 0 && likedItems.every((item) => item.checked);

  return (
    <>
      <Text color="#000000" fontWeight="bold" fontSize="28px" height="40px">좋아요</Text>
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
          checked={isAllLikedItemChecked}
          onCheckedChange={() =>
            toggleAllChecked("like")
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
      </Box>
      <Box flex="1" overflowY="auto" height="calc(100vh - 200px)" paddingBottom="80px">
        <Tabs.Root value="like">
          <Tabs.Content value="like" style={{ height: "100%" }}>
            {likedItems.length === 0 && (
              <Box color={"black"} px={"40px"}>
                좋아요에 담긴 상품이 없습니다.
              </Box>
            )}
            {likedItems.map((item) => (
              <LikedItem
                key={item.id}
                item={item}
                cartHas={cartItemsIdsAllSet.has(item.id)}
                handleChecked={() => toggleChecked(item.id, "like")}
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
            flex="1"
            _hover={{
              bg: "#eeeeeeff",
              transform: "scale(1.03)",
              transition: "all 0.2s ease-in-out",
            }}
            h="40px"
            color={"#000000"}
            bg={"#ffffffff"}
            fontWeight={"medium"}
            marginTop="10px"
            border="1px solid #d6d6d6ff"
            marginRight="10px"
            onClick={() => clear("like")}
          >
            전체 삭제
          </Button>

          <Button
            flex="1"
            _hover={{
              bg: "#e55b5b",
              transform: "scale(1.03)",
              transition: "all 0.2s ease-in-out",
            }}
            h="40px"
            color={"white"}
            bg={"#FA6D6D"}
            fontWeight={"medium"}
            onClick={addLikedItemsToCart}
            marginTop="10px"
          >
            장바구니 담기
          </Button>
        </Box>
      </Box>
    </>
  );
}

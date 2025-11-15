"use client";
import { Drawer, Portal, Button, Tabs, Box, Checkbox } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import LikedItem from "./LikedItem";
import ShoppingCartIconButton from "./ui/ShoppingCartIconButton";
import { useCart } from "@/contexts/ShoppingCartContext";

export default function ShoppingCartDrawer({
  headerHeight,
}: {
  headerHeight: number;
}) {
  const [isCartActivity, setIsCartActivity] = useState(false);
  const [currentTabsValue, setCurrentTabsValue] = useState("cart");

  const {
    cartItems,
    likedItems,
    toggleChecked,
    toggleAllChecked,
    updateQuantity,
    removeItem,
    clear,
    toggleLike,
    addLikedItemsToCart,
    isLiked,
  } = useCart();

  // 계산 로직들은 Context에서 가져온 상태를 기반으로 수행
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item.checked ? (item.price - item.discountAmount) * item.num : 0),
    0
  );
  const cartItemsIdsAllSet = useMemo(
    () => new Set(cartItems.map((item) => item.id)),
    [cartItems]
  );
  const isAllCartChecked =
    cartItems.length > 0 && cartItems.every((item) => item.checked);
  const isAllLikedItemChecked =
    likedItems.length > 0 && likedItems.every((item) => item.checked);

  /* 화면UI 시작 (모든 핸들러 함수가 Context의 함수로 대체됨) */
  return (
    <Drawer.Root
      open={isCartActivity}
      onOpenChange={(details) => setIsCartActivity(details.open)}
      preventScroll={false}
    >
      <Drawer.Trigger asChild>
        <ShoppingCartIconButton
          cartItemsLength={cartItems.length}
          isCartActivity={isCartActivity}
          setIsCartActivity={setIsCartActivity}
        />
      </Drawer.Trigger>

      <Portal>
        <Drawer.Positioner top={`${headerHeight}px`} right="0" bottom="0">
          <Drawer.Content
            display={"flex"}
            flexDirection={"column"}
            flex="1"
            background={"white"}
            maxW={"530px"}
            w="100%"
            height={`calc(100vh - ${headerHeight}px)`}
          >
            <Tabs.Root
              value={currentTabsValue}
              onValueChange={(e) => setCurrentTabsValue(e.value)}
              display="flex"
              w={"100%"}
              flexDirection="column"
              flex="1"
              overflow="hidden"
              defaultValue="cart"
            >
              <Drawer.Header
                justifyContent="space-between"
                alignItems="center"
                color={"black"}
                px="40px"
                w={"100%"}
                height={"49px"}
              >
                <Tabs.List borderBottom={"none"} display={"flex"} w="100%">
                  <Tabs.Trigger
                    value="cart"
                    color="#B2B2B2"
                    flex={1}
                    borderBottom={"1px solid #B2B2B2"}
                    bottom={"-1px"}
                    _selected={{ color: "#FA6D6D", bottom: "0px" }}
                  >
                    <Drawer.Title
                      w={"100%"}
                      fontSize="16px"
                      fontWeight="medium"
                    >
                      장바구니
                    </Drawer.Title>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="like"
                    color="#B2B2B2"
                    flex={1}
                    borderBottom={"1px solid #B2B2B2"}
                    bottom={"-1px"}
                    _selected={{ color: "#FA6D6D", bottom: "0px" }}
                  >
                    <Drawer.Title
                      w={"100%"}
                      fontSize="16px"
                      fontWeight="medium"
                    >
                      좋아요
                    </Drawer.Title>
                  </Tabs.Trigger>
                  <Tabs.Indicator
                    height="1px"
                    bg="#FA6D6D"
                    boxShadow="none"
                    position={"absolute"}
                    bottom={"-1px"}
                  />
                </Tabs.List>
              </Drawer.Header>

              <Drawer.Body
                minHeight={0}
                overflowY={"hidden"}
                display={"flex"}
                padding={0}
                flexDirection={"column"}
                paddingTop={"20px"}
                background={"white"}
              >
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  w={"100%"}
                  h={"20px"}
                  gap={"16px"}
                  alignItems={"center"}
                  px={"40px"}
                >
                  <Checkbox.Root
                    w="20px"
                    variant={"outline"}
                    colorPalette={"red"}
                    checked={
                      currentTabsValue === "cart"
                        ? isAllCartChecked
                        : isAllLikedItemChecked
                    }
                    onCheckedChange={() =>
                      toggleAllChecked(currentTabsValue as "cart" | "like")
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  <Box color="#CCCCCC">|</Box>
                  <Box
                    display={"flex"}
                    flex={1}
                    justifyContent={"center"}
                    color={"black"}
                    fontWeight={"bold"}
                  >
                    상품정보
                  </Box>
                </Box>
                <Box flex="1" overflowY="auto">
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
                </Box>
              </Drawer.Body>
            </Tabs.Root>

            <Drawer.Footer px="40px" flexShrink={0} display={"flex"}>
              <Button
                flex={1}
                color={"black"}
                bg={"white"}
                fontWeight={"medium"}
                border={"1px solid #CCCCCC"}
                onClick={() => clear(currentTabsValue)}
              >
                전체 삭제
              </Button>
              {currentTabsValue === "cart" && (
                <Button
                  flex={1}
                  color={"white"}
                  bg={"#FA6D6D"}
                  fontWeight={"medium"}
                >
                  {numberFormatter.format(totalPrice)}원 구매하기
                </Button>
              )}
              {currentTabsValue === "like" && (
                <Button
                  flex={1}
                  color={"white"}
                  bg={"#FA6D6D"}
                  fontWeight={"medium"}
                  onClick={addLikedItemsToCart}
                >
                  장바구니 담기
                </Button>
              )}
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

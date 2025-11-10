"use client";
import {
  Drawer,
  Portal,
  Button,
  IconButton,
  Tabs,
  Box,
  Checkbox,
  Float,
  Circle,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CartIcon } from "./ui/CartIcon";
import ShoppingCartItem from "./ShoppingCartItem";

export interface ShoppingCartProps {
  checked: boolean;
  title: string;
  brand: string;
  image: string;
  num: number;
  price: number;
  isDiscounted: boolean;
  discountMount: number;
}

export default function ShoppingCartDrawer({
  headerHeight,
  initShoppingCartItems = [
    {
      checked: false,
      title: "test1",
      brand: "brand temp 1",
      image: "https://cdn.imweb.me/thumbnail/20220924/2f7f6930fd5c3.png",
      num: 1,
      price: 10000,
      isDiscounted: true,
      discountMount: 1000,
    },
    {
      checked: true,
      title: "test2",
      brand: "brand temp 2",
      image:
        "https://cafe24.poxo.com/ec01/romand/6aDrbsrpgztyixM+aENnH1D89vbvN874SJZ0smDxiaa/k9zGF5hClK+Cdcc6Crl70h/a8RobAiR24eeOO4zRMg==/_/web/product/extra/big/202309/d8ec45bee3b0c4c201521845e7c8f5a9.jpg",
      num: 2,
      price: 1500,
      isDiscounted: false,
      discountMount: 0,
    },
    {
      checked: true,
      title: "test2",
      brand: "brand temp 2",
      image:
        "https://cafe24.poxo.com/ec01/romand/6aDrbsrpgztyixM+aENnH1D89vbvN874SJZ0smDxiaa/k9zGF5hClK+Cdcc6Crl70h/a8RobAiR24eeOO4zRMg==/_/web/product/extra/big/202309/d8ec45bee3b0c4c201521845e7c8f5a9.jpg",
      num: 2,
      price: 1500,
      isDiscounted: false,
      discountMount: 0,
    },
  ],
}: {
  headerHeight: number;
  initShoppingCartItems?: ShoppingCartProps[];
}) {
  const [isCartActivity, setIsCartActivity] = useState(false);
  const [shoppingCartItems, setShoppingCartItems] = useState(
    initShoppingCartItems
  );
  const isAllChecked = shoppingCartItems.every((item) => item.checked);
  const isInderterminate =
    shoppingCartItems.some((item) => item.checked) && !isAllChecked;

  const handleDeleteAll = () => {
    setShoppingCartItems([]);
  };

  const handleToggleAllChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShoppingCartItems((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const handleToggleChecked = (index: number) => {
    setShoppingCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const totalPrice = shoppingCartItems.reduce(
    (sum, item) => sum + (item.checked ? item.price * item.num : 0),
    0
  );

  return (
    <Drawer.Root
      open={isCartActivity}
      onOpenChange={(details) => setIsCartActivity(details.open)}
    >
      <Drawer.Trigger asChild>
        <IconButton
          aria-label="장바구니"
          onClick={() => {
            setIsCartActivity((prev) => !prev);
          }}
          cursor="pointer"
          position={"relative"}
        >
          <CartIcon
            w={{ base: 5, md: 6 }}
            h={{ base: 5, md: 6 }}
            color={isCartActivity ? "#FA6D6D" : "black"}
          >
            <Float>
              <Circle size="5" bg="red" color="white">
                3
              </Circle>
            </Float>
          </CartIcon>
        </IconButton>
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
              defaultValue="cart"
              display="flex"
              flexDirection="column"
              flex="1"
            >
              <Drawer.Header
                justifyContent="space-between"
                alignItems="center"
                color={"black"}
                px="40px"
                height={"49px"}
              >
                <Tabs.List borderBottom={"none"}>
                  <Tabs.Trigger
                    value="cart"
                    color="#B2B2B2"
                    borderBottom={"1px solid #B2B2B2"}
                    _selected={{ color: "#FA6D6D" }}
                  >
                    <Drawer.Title fontSize="16px" fontWeight="medium">
                      장바구니
                    </Drawer.Title>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="like"
                    color="#B2B2B2"
                    borderBottom={"1px solid #B2B2B2"}
                    _selected={{ color: "#FA6D6D" }}
                  >
                    <Drawer.Title fontSize="16px" fontWeight="medium">
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
                <Button
                  fontSize={"12px"}
                  fontWeight="medium"
                  onClick={handleDeleteAll}
                >
                  전체 삭제
                </Button>
              </Drawer.Header>

              <Drawer.Body
                px="40px"
                minHeight={0}
                flex={1}
                overflowY={"scroll"}
                display={"flex"}
                flexDirection={"column"}
                paddingTop={"20px"}
              >
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  w={"100%"}
                  h={"20px"}
                  gap={"16px"}
                  alignItems={"center"}
                >
                  <Checkbox.Root>
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
                <Tabs.Content value="cart">
                  {shoppingCartItems.length === 0 && (
                    <Box>장바구니에 담긴 상품이 없습니다.</Box>
                  )}
                  {shoppingCartItems.map((item, idx) => {
                    return (
                      <ShoppingCartItem
                        key={idx}
                        item={item}
                        handleToggleChecked={() => handleToggleChecked(idx)}
                        allChecked={isAllChecked}
                      />
                    );
                  })}
                </Tabs.Content>

                <Tabs.Content value="like">
                  <Box p={4}>좋아요에 담긴 상품이 없습니다.</Box>
                </Tabs.Content>
              </Drawer.Body>
            </Tabs.Root>

            <Drawer.Footer px="40px" flexShrink={0}>
              <Button
                w={"100%"}
                color={"white"}
                bg={"#FA6D6D"}
                fontWeight={"medium"}
              >
                {totalPrice}원 구매하기
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

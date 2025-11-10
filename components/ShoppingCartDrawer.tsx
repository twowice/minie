"use client";
import {
  Drawer,
  Portal,
  Button,
  CloseButton,
  IconButton,
  Tabs,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CartIcon } from "./ui/CartIcon";

export default function ShoppingCartDrawer({
  headerHeight,
}: {
  headerHeight: number;
}) {
  const [isCartActivity, setIsCartActivity] = useState(false);

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
        >
          <CartIcon
            w={{ base: 5, md: 6 }}
            h={{ base: 5, md: 6 }}
            color={isCartActivity ? "#FA6D6D" : "black"}
          />
        </IconButton>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Positioner top={`${headerHeight}px`} right="0" bottom="0">
          <Drawer.Content background={"white"} maxW={"530px"} w="100%">
            <Tabs.Root defaultValue="cart" color={"black"}>
              <Drawer.Header
                justifyContent="space-between"
                alignItems="center"
                color={"black"}
                px="40px"
              >
                <Tabs.List>
                  <Tabs.Trigger value="cart">
                    <Drawer.Title
                      fontSize="lg"
                      fontWeight="medium"
                      color={"black"}
                    >
                      장바구니
                    </Drawer.Title>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="like">
                    <Drawer.Title
                      fontSize="lg"
                      fontWeight="medium"
                      color={"black"}
                    >
                      좋아요
                    </Drawer.Title>
                  </Tabs.Trigger>
                </Tabs.List>
                <Box>전체 삭제</Box>
              </Drawer.Header>

              <Drawer.Body px="40px">
                <Tabs.Content value="cart">
                  <Box p={4}>장바구니에 담긴 상품이 없습니다.</Box>
                </Tabs.Content>

                <Tabs.Content value="like">
                  <Box p={4}>좋아요에 담긴 상품이 없습니다.</Box>
                </Tabs.Content>
              </Drawer.Body>

              <Drawer.Footer px="40px">
                <Button variant="outline">Cancel</Button>

                <Button>Save</Button>
              </Drawer.Footer>
            </Tabs.Root>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

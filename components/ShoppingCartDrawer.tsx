"use client";
import { Drawer, Portal, Button, Tabs, Box, Checkbox } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import LikedItem from "./LikedItem";
import ShoppingCartIconButton from "./ui/ShoppingCartIconButton";
import { CartItem } from "@/app/api/cart/cart";

/* 테스트 케이스용 더미데이터 */
const testCartItems = [
  {
    id: 0,
    checked: false,
    title: "test1",
    brand: "brand temp 1",
    image: "https://cdn.imweb.me/thumbnail/20220924/2f7f6930fd5c3.png",
    num: 1,
    price: 10000,
    isDiscounted: true,
    discountAmount: 1000,
  },
  {
    id: 1,
    checked: true,
    title: "test2",
    brand: "brand temp 2",
    image:
      "https://cafe24.poxo.com/ec01/romand/6aDrbsrpgztyixM+aENnH1D89vbvN874SJZ0smDxiaa/k9zGF5hClK+Cdcc6Crl70h/a8RobAiR24eeOO4zRMg==/_/web/product/extra/big/202309/d8ec45bee3b0c4c201521845e7c8f5a9.jpg",
    num: 2,
    price: 1500,
    isDiscounted: false,
    discountAmount: 0,
  },
  {
    id: 2,
    checked: true,
    title: "unlike test33333",
    brand: "unlike brand temp 3",
    image:
      "https://cafe24.poxo.com/ec01/romand/6aDrbsrpgztyixM+aENnH1D89vbvN874SJZ0smDxiaa/k9zGF5hClK+Cdcc6Crl70h/a8RobAiR24eeOO4zRMg==/_/web/product/extra/big/202309/d8ec45bee3b0c4c201521845e7c8f5a9.jpg",
    num: 2,
    price: 6000,
    isDiscounted: true,
    discountAmount: 5000,
  },
  {
    id: 3,
    checked: true,
    title: "test44like",
    brand: "brand temp 3",
    image:
      "https://cafe24.poxo.com/ec01/romand/6aDrbsrpgztyixM+aENnH1D89vbvN874SJZ0smDxiaa/k9zGF5hClK+Cdcc6Crl70h/a8RobAiR24eeOO4zRMg==/_/web/product/extra/big/202309/d8ec45bee3b0c4c201521845e7c8f5a9.jpg",
    num: 2,
    price: 6000,
    isDiscounted: true,
    discountAmount: 5000,
  },
];
const testLikedItems = [
  {
    id: 4,
    checked: true,
    title: "only like",
    brand: "brandC",
    image:
      "https://www.clarins.co.kr/dw/image/v2/AAJY_PRD/on/demandware.static/-/Sites-clarins-master-products/default/dw0594baa6/original/80104492_original_original_A.jpg?sw=680&sh=680",
    num: 1,
    price: 6000,
    isDiscounted: true,
    discountAmount: 5000,
  },
];
const testLikedItemsIds = new Set([0, 1, 3]);

/* 각 아이템들을 인자로 넣어주지 않으면 테스트케이스로 작동합니다. */

export default function ShoppingCartDrawer({
  headerHeight,
  initCartItems = testCartItems,
  _initLikedItemsIdsForTest = testLikedItemsIds,
  initLikedItems = testLikedItems,
}: {
  headerHeight: number;
  initCartItems?: CartItem[];
  _initLikedItemsIdsForTest?: Set<number>;
  initLikedItems?: CartItem[];
}) {
  const [isCartActivity, setIsCartActivity] = useState(false);
  const [currentTabsValue, setCurrentTabsValue] = useState("cart");
  const [cartItems, setcartItems] = useState(initCartItems);
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item.checked ? (item.price - item.discountAmount) * item.num : 0),
    0
  );
  const [likedItems, setLikedItems] = useState<CartItem[]>(() => {
    if (initLikedItems !== testLikedItems) {
      return initLikedItems;
    }
    const filtered = initCartItems.filter((item) =>
      _initLikedItemsIdsForTest.has(item.id)
    );
    const mapped = filtered.map((item) => ({ ...item, checked: false }));

    return [...initLikedItems, ...mapped];
  });
  const likedItemIdsAllSet = useMemo(() => {
    return new Set(likedItems.map((item) => item.id));
  }, [likedItems]);

  const cartItemsIdsAllSet = useMemo(() => {
    return new Set(cartItems.map((item) => item.id));
  }, [cartItems]);

  const isAllCartChecked =
    cartItems.every((item) => item.checked) && cartItems.length !== 0;
  const isAllLikedItemChecked =
    likedItems.every((item) => item.checked) && likedItems.length !== 0;

  /* 컴포넌트 제어용 함수 시작 */
  const handleDeleteAll = () => {
    if (currentTabsValue === "cart") {
      setcartItems([]);
    } else if (currentTabsValue === "like") {
      setLikedItems([]);
    }
  };
  const handleCartDelete = (id: number) => {
    setcartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAllChecked = (checked: boolean) => {
    if (currentTabsValue === "cart") {
      setcartItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    } else if (currentTabsValue === "like") {
      setLikedItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    }
  };
  const handleChecked = (id: number) => {
    if (currentTabsValue === "cart") {
      setcartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    } else if (currentTabsValue === "like") {
      setLikedItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    }
  };

  const handleNumChanged = (id: number, type?: string) => {
    switch (type) {
      case "plus":
        setcartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, num: item.num + 1 } : item
          )
        );
        break;
      case "minus":
        setcartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, num: item.num > 1 ? item.num - 1 : 1 }
              : item
          )
        );
        break;
      default:
        console.error("[handleNumChanged] 알 수 없는 조작 감지 ", type);
        break;
    }
  };

  const handleLike = (id: number, type?: string) => {
    switch (type) {
      case "like":
        setLikedItems((prev) => {
          const newLikedItem = cartItems.find((item) => item.id === id);
          return newLikedItem
            ? [{ ...newLikedItem, checked: false }, ...prev]
            : prev;
        });
        break;
      case "unlike":
        setLikedItems((prev) => prev.filter((item) => item.id !== id));
        break;
      default:
        console.error("[handleLike] 알 수 없는 조작 감지 ", type);
        break;
    }
  };

  const handleAddCartItems = () => {
    setcartItems((prev) => {
      const newCartItems = likedItems.filter(
        (item) => item.checked && !cartItemsIdsAllSet.has(item.id)
      );
      return [...newCartItems, ...prev];
    });
  };

  /* 화면UI 시작 */
  return (
    <Drawer.Root
      open={isCartActivity}
      onOpenChange={(details) => setIsCartActivity(details.open)}
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
              defaultValue="cart"
              display="flex"
              flexDirection="column"
              flex="1"
              overflow="hidden"
              value={currentTabsValue}
              onValueChange={(e) => setCurrentTabsValue(e.value)}
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
                    bottom={"-1px"}
                    _selected={{ color: "#FA6D6D", bottom: "0px" }}
                  >
                    <Drawer.Title w="80px" fontSize="16px" fontWeight="medium">
                      장바구니
                    </Drawer.Title>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="like"
                    color="#B2B2B2"
                    borderBottom={"1px solid #B2B2B2"}
                    bottom={"-1px"}
                    _selected={{ color: "#FA6D6D", bottom: "0px" }}
                  >
                    <Drawer.Title w="80px" fontSize="16px" fontWeight="medium">
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
                overflowY={"hidden"}
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
                  <Checkbox.Root
                    w="20px"
                    variant={"outline"}
                    colorPalette={"red"}
                    checked={
                      currentTabsValue === "cart"
                        ? isAllCartChecked
                        : isAllLikedItemChecked
                    }
                    onCheckedChange={(e) => {
                      handleAllChecked(!!e.checked);
                    }}
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
                      <Box color={"black"}>
                        장바구니에 담긴 상품이 없습니다.
                      </Box>
                    )}
                    {cartItems.map((item) => {
                      return (
                        <ShoppingCartItem
                          key={item.id}
                          item={item}
                          isLiked={likedItemIdsAllSet.has(item.id)}
                          handleChecked={() => handleChecked(item.id)}
                          handleNumChanged={(type?: string) =>
                            handleNumChanged(item.id, type)
                          }
                          handleCartDelete={() => handleCartDelete(item.id)}
                          handleLike={(type?: string) =>
                            handleLike(item.id, type)
                          }
                        />
                      );
                    })}
                  </Tabs.Content>
                  <Tabs.Content value="like" style={{ height: "100%" }}>
                    {likedItems.length === 0 && (
                      <Box color={"black"}>좋아요에 담긴 상품이 없습니다.</Box>
                    )}
                    {likedItems.map((item) => {
                      return (
                        <LikedItem
                          key={item.id}
                          item={item}
                          cartHas={cartItemsIdsAllSet.has(item.id)}
                          handleChecked={() => handleChecked(item.id)}
                          handleLike={(type?: string) =>
                            handleLike(item.id, type)
                          }
                        />
                      );
                    })}
                  </Tabs.Content>
                </Box>
              </Drawer.Body>
            </Tabs.Root>

            <Drawer.Footer px="40px" flexShrink={0}>
              {currentTabsValue === "cart" && (
                <Button
                  w={"100%"}
                  color={"white"}
                  bg={"#FA6D6D"}
                  fontWeight={"medium"}
                >
                  {numberFormatter.format(totalPrice)}원 구매하기
                </Button>
              )}
              {currentTabsValue === "like" && (
                <Button
                  w={"100%"}
                  color={"white"}
                  bg={"#FA6D6D"}
                  fontWeight={"medium"}
                  onClick={handleAddCartItems}
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

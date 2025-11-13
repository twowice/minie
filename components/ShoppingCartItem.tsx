import { Box, Checkbox, IconButton, Image } from "@chakra-ui/react";
import { CartItem } from "@/app/api/cart/cart";

import HeartFilledIcon from "./ui/HeartIcon";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { numberFormatter } from "../utils/formatter/numberFomatter";
import { getDiscountRate } from "@/utils/calculator/discountRateCalculator";
import { MdClose } from "react-icons/md";

/* 
ShoppingCartDrawer에서 기본적으로 인자에 건네주는 함수

  const handleDeleteAll = () => {
    if (currentTabsValue === "cart") {
      setcartItems([]);
    } else if (currentTabsValue) {
      setLikedItems([]);
    }
  };
  const handleCartDelete = (id: number) => {
    setcartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAllChecked = (checked: boolean) => {
    setcartItems((prev) => prev.map((item) => ({ ...item, checked })));
  };
  const handleChecked = (id: number) => {
    setcartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
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
            ? [...prev, { ...newLikedItem, checked: false }]
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
  
*/

export default function ShoppingCartItem({
  item,
  isLiked,
  handleChecked,
  handleNumChanged,
  handleCartDelete,
  handleLike,
}: {
  item: CartItem;
  isLiked: boolean;
  handleChecked: () => void;
  handleNumChanged: (type?: string) => void;
  handleCartDelete: () => void;
  handleLike: (type?: string) => void;
}) {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      gap={"16px"}
      color={"black"}
      borderBottom={"1px solid #CCCCCC"}
      py={"10px"}
    >
      <Checkbox.Root
        variant={"outline"}
        checked={item.checked}
        onCheckedChange={handleChecked}
        alignItems={"center"}
        colorPalette={"red"}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
      <Image src={item.image} w={130} h={130}></Image>
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"start"}
        >
          <Box>
            <Box fontWeight={"medium"}>{item.title}</Box>
            <Box color={"#808080"}>{item.brand}</Box>
          </Box>
          <IconButton onClick={handleCartDelete}>
            <MdClose />
          </IconButton>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"end"}
          gap={"4px"}
        >
          <IconButton
            color={item.num === 1 ? "#CCCCCC" : ""}
            onClick={() => handleNumChanged("minus")}
            disabled={item.num === 1}
          >
            <AiFillMinusCircle />
          </IconButton>
          <Box fontWeight={"medium"} fontSize={"16px"}>
            {item.num}
          </Box>
          <IconButton onClick={() => handleNumChanged("plus")}>
            <AiFillPlusCircle />
          </IconButton>
        </Box>
        {item.isDiscounted && (
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"end"}
            gap={"4px"}
          >
            <Box fontWeight={"medium"} color={"#FA6D6D"} fontSize={"12px"}>
              {getDiscountRate(item.price, item.discountAmount)}%
            </Box>
            <Box
              fontSize={"12px"}
              textDecoration={"line-through"}
              color={"#808080"}
            >
              {item.price * item.num}
            </Box>
            <Box fontSize={"12px"} color={"#808080"}>
              원
            </Box>
          </Box>
        )}
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              onClick={() => {
                isLiked ? handleLike("unlike") : handleLike("like");
              }}
            >
              <HeartFilledIcon
                filledColor={isLiked ? "#FA6D6D" : "none"}
                strokeColor={isLiked ? "#FA6D6D" : "#CCCCCC"}
              />
            </IconButton>
            <Box display={"flex"} gap={"2px"}>
              <Box fontSize={"16px"} fontWeight={"semibold"}>
                {numberFormatter.format(
                  (item.price - item.discountAmount) * item.num
                )}
              </Box>
              <Box fontSize={"16px"} fontWeight={"medium"}>
                원
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

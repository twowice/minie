import { OrderDetail } from "@/app/api/order/order";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { Box, Button, Flex, HStack, Image, Stack } from "@chakra-ui/react";

export default function TrackingOrderDetailItem({
  order,
  createAt,
  updatedAt,
  status,
}: {
  order: OrderDetail;
  createAt: string;
  updatedAt: string;
  status: string;
}) {
  return (
    <Flex
      p={3}
      h={"90px"}
      borderBottomWidth="1px"
      borderColor="#00000020"
      fontSize={"12px"}
      textAlign={"center"}
      alignItems={"center"}
      color={"black"}
    >
      <Box flex="1">{createAt.split("T")[0]}</Box>
      <HStack
        color={"black"}
        flex="3"
        textAlign="left"
        alignItems={"center"}
        gap={"12px"}
      >
        <Image src={order.productImage} w={"70px"} h={"70px"} fit={"contain"} />
        <Box>{order.productName}</Box>
      </HStack>
      <Box flex="1">{numberFormatter.format(order.price)}원</Box>
      <Stack flex="1" justifyContent={"center"} alignItems={"center"}>
        <Box>{status === "주문완료" ? "배송완료" : status}</Box>
        {status === "주문완료" && (
          <Button
            w={"46px"}
            h={"20px"}
            bg={"#F5F5F5"}
            borderRadius={"4px"}
            border={"1px solid #C4C4C4"}
            fontSize={"8px"}
          >
            리뷰작성
          </Button>
        )}
        {status === "주문취소" && <Box>{updatedAt.split("T")[0]}</Box>}
      </Stack>
    </Flex>
  );
}

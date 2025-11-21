import { OrdersForTracking } from "@/app/api/order/order";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { Box, Flex, Link, Stack } from "@chakra-ui/react";

export default function TrackingOrderItem({
  order,
}: {
  order: OrdersForTracking;
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
      <Box flex="1">{order.createdAt.split("T")[0]}</Box>
      <Link
        variant="underline"
        color={"black"}
        href={`order/${order.orderId}?created-at=${order.createdAt}&updated-at=${order.updatedAt}&status=${order.status}`}
        flex="3"
        textAlign="left"
      >
        {order.orderName}
      </Link>
      <Box flex="1">{numberFormatter.format(order.totalPrice)}원</Box>
      <Stack flex="1" justifyContent={"center"} alignItems={"center"}>
        <Box>{order.status === "주문완료" ? "배송완료" : order.status}</Box>
        {order.status === "주문취소" && (
          <Box>{order.updatedAt.split("T")[0]}</Box>
        )}
      </Stack>
    </Flex>
  );
}

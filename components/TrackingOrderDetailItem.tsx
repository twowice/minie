import { useState } from "react";
import { OrderDetail } from "@/app/api/order/order";
import { numberFormatter } from "@/utils/formatter/numberFomatter";
import { Box, Flex, HStack, Image, Stack } from "@chakra-ui/react";
import ReviewAddDialog from "@/components/ReviewAddDialog";
import { toaster } from "@/components/ui/toaster";

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
  /* 토스트 CKH */
  const [localHasReview, setLocalHasReview] = useState(order.has_review);
  const showSaveSuccessToast = () => {
    toaster.create({
      type: "success",
      title: "리뷰가 성공적으로 추가되었습니다!",
    });
  };
  const showSaveFailToast = () => {
    toaster.create({ type: "error", title: "리뷰 추가 실패!" });
  };

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
      <Box flex="1">{order.productNum}</Box>
      <Box flex="1">
        {numberFormatter.format(order.price * order.productNum)}원
      </Box>
      <Stack flex="1" justifyContent={"center"} alignItems={"center"}>
        <Box>{status === "주문완료" ? (localHasReview ? "리뷰완료" : "배송완료") : status}</Box>
        {status === "주문완료" && !localHasReview && (
          /* Add by CKH */
          <ReviewAddDialog
            id={order.id}
            productId={order.productId}
            productName={order.productName}
            productImage={order.productImage}
            onSuccess={() => {
              showSaveSuccessToast();
              setLocalHasReview(true);
            }}
            onFail={showSaveFailToast}
          />
        )}
        {status === "주문취소" && <Box>{updatedAt.split("T")[0]}</Box>}
      </Stack>
    </Flex>
  );
}

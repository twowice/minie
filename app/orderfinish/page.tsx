"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Container } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { getOrderExcludeOrderDetail } from "../../lib/minie/orderAPI";
import { Order } from "../api/order/order";
import { numberFormatter } from "@/utils/formatter/numberFomatter";

export default function OrderFinishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order-id");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (orderId === null || orderId.trim().length === 0) {
    alert("존재하지 않는 주문이거나 올바르지 않은 주문 번호입니다.");
    router.replace("/");
    return null;
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        const fetchedOrder = await getOrderExcludeOrderDetail(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          setError("주문 정보를 불러오지 못했습니다.");
          alert("주문 정보를 찾을 수 없습니다.");
          router.replace("/");
        }
      } catch (err: any) {
        console.error("주문 정보를 불러오는 중 오류 발생:", err);
        setError(
          err.message || "주문 정보를 불러오는 중 예상치 못한 오류 발생."
        );
        alert("주문 정보를 불러오는 중 오류가 발생했습니다.");
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <Container
        bg={"white"}
        display={"flex"}
        flexDirection={"column"}
        maxW="7xl"
        py={"24px"}
        gap={"10px"}
        color={"black"}
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <Box fontWeight={"semibold"} fontSize={"32px"}>
          주문 정보를 불러오는 중...
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container
        bg={"white"}
        display={"flex"}
        flexDirection={"column"}
        maxW="7xl"
        py={"24px"}
        gap={"10px"}
        color={"black"}
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <Box fontWeight={"semibold"} fontSize={"32px"}>
          오류 발생
        </Box>
        <Box color={"red.500"}>
          {error || "주문 정보를 표시할 수 없습니다."}
        </Box>
      </Container>
    );
  }

  return (
    <Container
      bg={"white"}
      display={"flex"}
      flexDirection={"column"}
      maxW="7xl"
      py={"24px"}
      gap={"10px"}
      color={"black"}
      px={{ base: 4, sm: 6, lg: 8 }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        paddingBottom={"34px"}
      >
        <Box fontWeight={"semibold"} fontSize={"32px"}>
          주문완료
        </Box>
        <Box display={"flex"} gap={"8px"} alignItems={"center"}>
          <Box color={"#B2B2B2"} fontSize={"16px"}>
            01 장바구니
          </Box>
          <MdOutlineArrowForwardIos color={"#B2B2B2"} size={"15px"} />
          <Box fontSize={"16px"} color={"#B2B2B2"}>
            02 주문/결제
          </Box>
          <MdOutlineArrowForwardIos color={"#B2B2B2"} size={"15px"} />
          <Box fontSize={"16px"}>03 주문완료</Box>
        </Box>
      </Box>

      {/* 확인용*/}
      <Box mt={4}>
        <Box fontSize={"24px"} fontWeight={"bold"}>
          !
        </Box>
        <Box fontSize={"18px"} mt={2}>
          주문 번호: {order.orderId}
        </Box>
        <Box fontSize={"18px"}>
          결제 금액: {numberFormatter.format(order.totalPrice)}원
        </Box>
        <Box fontSize={"18px"}>
          결제 상태: {order.status === "paid" ? "결제 완료" : order.status}
        </Box>
      </Box>
    </Container>
  );
}

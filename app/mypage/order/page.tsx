"use client";
import { OrdersForTracking } from "@/app/api/order/order";
import PlainPagination from "@/components/Pagination";
import TrackingOrderItem from "@/components/TrackingOrderItem";
import { getOrdersForTracking } from "@/lib/minie/orderAPI";
import { Text, HStack, Box, VStack, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function Page() {
  const [orders, setOrders] = useState<OrdersForTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  let prevPay = 0;
  let afterPay = 0;
  let cancelOrder = 0;
  let duringDelivery = 0;
  let finishedDelivery = 0;

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const fetchedOrders = await getOrdersForTracking();
        setOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Error in Page component fetching orders:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const currentOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function content() {
    if (loading) return <Box color="black">주문 내역 로딩 중...</Box>;
    if (error)
      return <Box color="black">오류 발생: {error || "알 수 없는 오류"}</Box>;
    if (orders.length === 0)
      return <Box color="black">주문 내역이 없습니다.</Box>;

    return currentOrders.map((order, idx) => (
      <TrackingOrderItem key={idx} order={order} />
    ));
  }

  console.log(orders);

  for (const order of orders) {
    switch (order.status) {
      case "결제 전":
        prevPay++;
        break;
      case "주문완료":
        afterPay++;
        break;
      case "주문취소":
        cancelOrder++;
        break;
      case "배송중":
        duringDelivery++;
        break;
      case "배송완료":
        finishedDelivery++;
        break;
    }
  }

  return (
    <Box color={"black"}>
      <Text color="#000000" fontWeight="bold" fontSize="28px" height="40px">
        주문 조회
      </Text>
      <HStack
        justify="space-between"
        align="center"
        color="#00000050"
        backgroundColor="#00000010"
        paddingLeft="60px"
        paddingRight="60px"
        paddingTop="21px"
        paddingBottom="21px"
      >
        <VStack>
          <Box fontSize="48px" fontWeight="medium">
            {cancelOrder}
          </Box>
          <Box>주문 취소</Box>
        </VStack>
        <Box color="#696868"></Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">
            {prevPay}
          </Box>
          <Box>결제 전</Box>
        </VStack>
        <Box color="#696868">▶</Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">
            {afterPay}
          </Box>
          <Box>주문 완료</Box>
        </VStack>
        <Box color="#696868">▶</Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">
            {duringDelivery}
          </Box>
          <Box>배송 중</Box>
        </VStack>
        <Box color="#696868">▶</Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">
            {finishedDelivery}
          </Box>
          <Box>배송 완료</Box>
        </VStack>
      </HStack>

      <VStack align="start" color="#000000" fontSize="12px" py={"8px"}>
        <Text>
          • 2017년 4월 1일 이후 내역만 조회가 가능하며, 이전의 주문내역은 Minié
          주문내역에서 확인하실 수 있습니다.
        </Text>
        <Text>
          • 매장 구매는 포인트 적립을 한 경우, 최근 1년 내역만 조회가
          가능합니다. (2019년 9월 27일 이후 내역만 조회 가능)
        </Text>
      </VStack>

      <Box
        overflow="hidden"
        color="#000000"
        fontWeight="regular"
        fontSize="12px"
        textAlign="center"
      >
        <Flex bg="#00000010" p={3} borderTopWidth="1px">
          <Box flex="1">주문일자</Box>
          <Box flex="3">상품</Box>
          <Box flex="1">주문금액</Box>
          <Box flex="1">상태</Box>
        </Flex>
      </Box>

      {content()}

      {totalPages > 1 && (
        <PlainPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </Box>
  );
}

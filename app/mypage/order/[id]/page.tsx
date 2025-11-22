"use client";
import { OrderDetail, OrdersForTracking } from "@/app/api/order/order";
import PlainPagination from "@/components/Pagination";
import TrackingOrderDetailItem from "@/components/TrackingOrderDetailItem";
import { getOrderDetails, getOrderDetailsCount } from "@/lib/minie/orderAPI";
import { Text, Stack, Box, Flex, Button } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const createAt = searchParams.get("created-at");
  const updatedAt = searchParams.get("updated-at");
  const status = searchParams.get("status");

  if (!createAt || !updatedAt || !status) {
    if (typeof window !== "undefined") {
      alert("잘못된 링크입니다.");
    }
    router.replace("/mypage/order");
    return;
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const countData = await getOrderDetailsCount(orderId);
        setTotalPages(countData.totalPages);
        const fetchedOrders = await getOrderDetails(
          orderId,
          currentPage,
          countData.itemsPerPage
        );
        setOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Error in Page component fetching orders:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [currentPage]);

  if (loading) return <Box color="black">주문 내역 로딩 중...</Box>;
  if (error)
    return <Box color="black">오류 발생: {error || "알 수 없는 오류"}</Box>;
  if (!orders || orders.length === 0)
    return <Box color="black">주문 내역이 없습니다.</Box>;

  console.log(orders);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Stack color={"black"} paddingBottom={"28px"}>
      <Text color="#000000" fontWeight="bold" fontSize="28px" height="40px">
        상세 주문 조회
      </Text>
      <Box
        overflow="hidden"
        color="#000000"
        fontWeight="regular"
        fontSize="12px"
        textAlign="center"
      >
        {/* Header */}
        <Flex bg="#00000010" p={3} borderTopWidth="1px">
          <Box flex="1">주문일자</Box>
          <Box flex="3">상품</Box>
          <Box flex="1">수량</Box>
          <Box flex="1">주문금액</Box>
          <Box flex="1">상태</Box>
        </Flex>
      </Box>
      {orders.map((order, idx) => (
        <TrackingOrderDetailItem
          key={idx}
          order={order}
          createAt={createAt}
          updatedAt={updatedAt}
          status={status}
        ></TrackingOrderDetailItem>
      ))}
      <PlainPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={(changedPage: number) =>
          handlePageChange(changedPage)
        }
      />
    </Stack>
  );
}

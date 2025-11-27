"use client";

import {
  Box,
  Table,
  Heading,
  NativeSelect,
  Input,
  Button,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, ChangeEvent } from "react";
import PlainPagination from "@/components/Pagination";
import { OrderForManage } from "../api/order/order";
import {
  getAllOrders,
  getAllOrdersCount,
  updateOrderStatus,
} from "@/lib/minie/orderAPI";
import OrderItemForManage from "@/components/OrderItemForManage";
import { toaster } from "@/components/ui/toaster";

const ITEMS_PER_PAGE = 5;

export default function Delivery() {
  const [orders, setOrders] = useState<OrderForManage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    searchType: "orderId",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const fetchOrdersAndCount = async () => {
      setIsLoading(true);

      const apiFilters = {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        orderId:
          filters.searchType === "orderId" ? filters.searchTerm : undefined,
        userName:
          filters.searchType === "user" ? filters.searchTerm : undefined,
      };

      try {
        const [fetchedOrders, countData] = await Promise.all([
          getAllOrders(apiFilters, currentPage, ITEMS_PER_PAGE),
          getAllOrdersCount(apiFilters),
        ]);

        setOrders(fetchedOrders);
        setTotalPages(countData.totalPages);
      } catch (error) {
        console.error("Failed to fetch orders or count:", error);
        setOrders([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersAndCount();
  }, [currentPage, searchTrigger]);
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFiltersAndSearch = () => {
    setFilters({
      status: "",
      searchType: "orderId",
      searchTerm: "",
      startDate: "",
      endDate: "",
    });
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      setSearchTrigger((t) => t + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      setSearchTrigger((t) => t + 1);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderForManage["status"]
  ) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toaster.create({
          title: "주문 상태 변경.",
          description: `주문(${orderId})의 상태가 ${newStatus}(으)로 변경되었습니다.`,
          type: "success",
          duration: 3000,
          closable: true,
        });
      } else {
        throw new Error("API에서 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error(`주문(${orderId})의 상태 변경에 실패했습니다.:`, error);
      toaster.create({
        title: "상태 변경 실패.",
        description:
          error instanceof Error
            ? error.message
            : "주문 상태를 변경할 수 없습니다.",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };
  return (
    <Box color={"black"} mt={8}>
      <Heading as="h2" size="lg" mb={6}>
        전체 주문 관리
      </Heading>

      <VStack
        gap={4}
        align="stretch"
        mb={8}
        borderWidth="1px"
        borderRadius="md"
        p={4}
      >
        <HStack gap={4}>
          <NativeSelect.Root size="sm" flex={1}>
            <NativeSelect.Field
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              bg={"white"}
            >
              <option value="">전체 상태</option>
              <option value="결제 전">결제 전</option>
              <option value="주문완료">주문완료</option>
              <option value="배송중">배송중</option>
              <option value="배송완료">배송완료</option>
              <option value="주문취소">주문취소</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <HStack flex={2}>
            <Input
              name="startDate"
              type="date"
              size="sm"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <Text>~</Text>
            <Input
              name="endDate"
              type="date"
              size="sm"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </HStack>
        </HStack>
        <HStack gap={4}>
          <NativeSelect.Root size="sm" w="120px">
            <NativeSelect.Field
              name="searchType"
              value={filters.searchType}
              onChange={handleFilterChange}
            >
              <option value="orderId">주문번호</option>
              <option value="user">주문자</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Input
            name="searchTerm"
            placeholder="검색어를 입력하세요"
            size="sm"
            flex={1}
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />
        </HStack>
        <HStack justify="flex-end">
          <Button
            bg={"white"}
            size="sm"
            onClick={resetFiltersAndSearch}
            variant="outline"
            color={"black"}
          >
            초기화
          </Button>
          <Button bg={"black"} size="sm" onClick={handleSearch} color={"white"}>
            검색
          </Button>
        </HStack>
      </VStack>

      <Table.Root variant="outline" size="sm">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader color={"black"}>주문번호</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>주문자</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>주문시점</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>상품명</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>결제금액</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>주문상태</Table.ColumnHeader>
            <Table.ColumnHeader color={"black"}>상태변경</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Box textAlign="center" py={10}>
                  주문 목록을 불러오는 중...
                </Box>
              </Table.Cell>
            </Table.Row>
          ) : orders.length > 0 ? (
            orders.map((order, idx) => (
              <OrderItemForManage
                key={idx}
                order={order}
                handleStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Box textAlign="center" py={10}>
                  표시할 주문이 없습니다.
                </Box>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

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

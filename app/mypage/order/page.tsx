"use client";
import { Text, HStack, Box, VStack, Flex } from "@chakra-ui/react";
export default function Page() {
  return (
    <>
      <Text color="#000000" fontWeight="bold" fontSize="28px" height="40px">주문 조회</Text>
      <HStack justify="space-between" align="center" color="#00000050" backgroundColor="#00000010" paddingLeft="60px" paddingRight="60px" paddingTop="21px" paddingBottom="21px">
        <VStack>
          <Box fontSize="48px" fontWeight="medium">0</Box>
          <Box>주문 접수</Box>
        </VStack>
        <Box color="#696868">
          ▶
        </Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">1</Box>
          <Box>결제 완료</Box>
        </VStack>
        <Box color="#696868">
          ▶
        </Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">0</Box>
          <Box>배송 준비중</Box>
        </VStack>
        <Box color="#696868">
          ▶
        </Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">0</Box>
          <Box>배송 중</Box>
        </VStack>
        <Box color="#696868">
          ▶
        </Box>
        <VStack>
          <Box fontSize="48px" fontWeight="medium">1</Box>
          <Box>배송 완료</Box>
        </VStack>
      </HStack>

      <VStack align="start" color="#000000" fontSize="12px" height="44px">
        <Text>• 2017년 4월 1일 이후 내역만 조회가 가능하며, 이전의 주문내역은 Minié 주문내역에서 확인하실 수 있습니다.</Text>
        <Text>• 매장 구매는 포인트 적립을 한 경우, 최근 1년 내역만 조회가 가능합니다. (2019년 9월 27일 이후 내역만 조회 가능)</Text>
      </VStack>

      <Box overflow="hidden" color="#000000" fontWeight="regular" fontSize="12px" textAlign="center">
        {/* Header */}
        <Flex bg="#00000010" p={3} borderTopWidth="1px">
          <Box flex="1">주문일자</Box>
          <Box flex="2">상품</Box>
          <Box flex="1">수량</Box>
          <Box flex="1">주문금액</Box>
          <Box flex="1">상태</Box>
        </Flex>

        {/* Row */}
        <Flex p={3} borderBottomWidth="1px" borderColor="#00000020">
          <Box flex="1">2024-11-19</Box>
          <Box flex="2" textAlign="left">상품명 예시</Box>
          <Box flex="1">1</Box>
          <Box flex="1">25,000원</Box>
          <Box flex="1">배송 완료</Box>
        </Flex>
      </Box>

    </>
  )
}

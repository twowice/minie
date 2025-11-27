"use client";

import {
  Container,
  Text,
  Flex,
  Box,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext"; // 2025-11-19(박영준)

export default function Page({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser(); // 2025-11-19(박영준)
  const isActive = (path: string) => pathname === path;

  return (
    <Container maxW={"7xl"} px={{ base: 4, sm: 6, lg: 8 }}>
      <Flex gap="32px">
        <Box w="184px" minW="184px">
          <Text
            color="#000000"
            fontWeight="bold"
            fontSize="28px"
            paddingBottom="16px"
          >
            마이페이지
          </Text>
          <VStack align="left" gap="10px">
            <Text color="#000000" fontWeight="semibold" fontSize="20px">
              마이 쇼핑
            </Text>
            <Link href="/mypage/order">
              <Text
                color={isActive("/mypage/order") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                주문 조회
              </Text>
            </Link>
            <Link href="/mypage/cart">
              <Text
                color={isActive("/mypage/cart") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                장바구니
              </Text>
            </Link>
            <Link href="/mypage/like">
              <Text
                color={isActive("/mypage/like") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                좋아요
              </Text>
            </Link>
          </VStack>

          <Box w="100%" h="1px" bg="#00000050" my="15px" />

          <VStack align="left" gap="10px">
            <Text color="#000000" fontWeight="semibold" fontSize="20px">
              마이 활동
            </Text>
            <Link href="/mypage/inquiry">
              <Text
                color={isActive("/mypage/inquiry") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                1:1 문의내역
              </Text>
            </Link>
            <Link href="/mypage/review">
              <Text
                color={isActive("/mypage/review") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                리뷰
              </Text>
            </Link>
          </VStack>

          <Box w="100%" h="1px" bg="#00000050" my="15px" />

          <VStack align="left" gap="10px">
            <Text color="#000000" fontWeight="semibold" fontSize="20px">
              마이 정보
            </Text>
            <Link href="/mypage/profile">
              <Text
                color={isActive("/mypage/profile") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                내 프로필
              </Text>
            </Link>
            <Link href="/mypage/withdraw">
              <Text
                color={isActive("/mypage/withdraw") ? "#FA6D6D" : "#000000"}
                fontWeight="light"
                fontSize="16px"
              >
                회원 탈퇴
              </Text>
            </Link>
          </VStack>
        </Box>

        <Box flex="1">
          <VStack align="stretch">
            <HStack
              backgroundColor="#FA6D6D"
              height="60px"
              gap="8px"
              paddingLeft="13px"
            >
              {/* 프로필 이미지 또는 기본 아이콘 2025-11-19(박영준)*/}
              {user?.profile_image ? (
                <Image
                  width="25px"
                  height="25px"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  src={user.profile_image}
                  alt="프로필"
                  fit={"contain"}
                  referrerPolicy="no-referrer"
                />
              ) : (
                // 기본 사용자 아이콘
                <Box
                  width="25px"
                  height="25px"
                  borderRadius="50%"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#FA6D6D" />
                    <path
                      d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                      fill="#FA6D6D"
                    />
                  </svg>
                </Box>
              )}
              <Text marginLeft="8px" fontSize="16px" color={"white"}>
                {user?.name || "게스트"}님 환영합니다.
              </Text>
            </HStack>
            <Box height="10px" />
            {children}
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

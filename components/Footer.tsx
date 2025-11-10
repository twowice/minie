"use client";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box as="footer" py={2} bg="rgba(204, 204, 204, 0.16)">
      <Container maxW="7xl" px={{ base: 4, lg: 8 }}>
        <Flex mb={2} direction={{ base: "column", md: "row" }}>
          {/* Left side */}
          <Heading
            as="h1"
            fontSize="24px"
            fontWeight="normal"
            color="black"
            cursor="pointer"
            fontStyle={"normal"}
            fontFamily="CroissantOne, cursive"
            display="flex"
            justifyContent="start"
            alignItems="center"
            mr={{ base: 0, md: "90px" }}
            mb={{ base: 4, md: 0 }}
          >
            Minié
          </Heading>
          {/* Right side */}
          <Flex
            justify="space-between"
            flexGrow={1}
            direction={{ base: "column", md: "row" }}
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading
                as="h1"
                fontSize="12px"
                fontWeight="lighter"
                fontStyle={"normal"}
                mb={2}
                color="rgba(0, 0, 0, 0.64)"
                fontFamily="CroissantOne, cursive"
              >
                Minié
              </Heading>
              <Box fontSize="12px" color="rgba(0, 0, 0, 0.64)">
                <Box>대표이사 : 이선영 | 사업자등록번호 : 000-00-00000</Box>
                <Box wordBreak="break-all">
                  주소: (04320) 서울특별시 용산구 원효대로 372, 24층 (용산동,
                  KDB타워)
                </Box>
                <Box>호스팅사업자 : Minié</Box>
                <Box>통신판매업신고번호 : 2019-서울용산-1428</Box>
                <Box wordBreak="break-all">
                  이메일 :{" "}
                  <Link
                    as={NextLink}
                    href="mailto:Miniéweb@Minie@.net"
                    color={"rgba(0, 0, 0, 0.64)"}
                    _hover={{ color: "black" }}
                  >
                    Miniéweb@Minie@.net
                  </Link>
                </Box>
              </Box>
            </Box>
            <Box
              textAlign={{ base: "left", md: "right" }}
              color="rgba(0, 0, 0, 0.64)"
            >
              <Flex
                justify={{ base: "flex-start", md: "flex-end" }}
                align="center"
                gap={2}
                mb={2}
              >
                <Text fontSize="base" fontWeight="bold">
                  고객센터
                </Text>
                <Text fontSize="base" fontWeight="bold">
                  1577-1577
                </Text>
              </Flex>
              <Text fontSize="xs">09:00~18:00 월-금</Text>
              <Text fontSize="xs">휴무 토-일</Text>
            </Box>
          </Flex>
        </Flex>
        <Box
          py={2}
          borderTopWidth="1px"
          borderTopColor="rgba(0, 0, 0, 0.16)"
          textAlign="center"
          fontSize="xs"
          color="rgba(0, 0, 0, 0.50)"
        >
          Copyright © Minié. All Rights Reserved.
        </Box>
      </Container>
    </Box>
  );
}

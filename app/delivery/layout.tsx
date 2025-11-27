"use client";
import NextLink from "next/link";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Spinner, // Spinner 임포트
} from "@chakra-ui/react";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      alert(
        "해당 페이지에 대한 접근 권한이 없습니다.\n메인페이지로 돌아갑니다."
      );
      router.replace("/");
    } else if (user !== null && !user.is_admin) {
      alert(
        `${user?.name}님께서는 해당 페이지에 대한 접근 권한이 없습니다.\n메인페이지로 돌아갑니다.`
      );
      router.replace("/");
    }
  }, [user, router]);

  if (user === null) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (user && user.is_admin) {
    return (
      <Container
        display={"flex"}
        flexDirection={"column"}
        maxW="7xl"
        bg="white"
        mx="auto"
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <Flex
          w="full"
          align="center"
          justify="space-between"
          py={{ base: 3, md: 4 }}
        >
          <Link
            as={NextLink}
            href="/delivery"
            _focus={{ boxShadow: "none", outline: "none" }}
            _hover={{ textDecoration: "none" }}
            alignItems={"end"}
          >
            <Heading
              as="h1"
              fontSize="24px"
              color="black"
              fontWeight="normal"
              cursor="pointer"
              fontStyle={"normal"}
              fontFamily="CroissantOne, cursive"
            >
              Minié
            </Heading>
            <Box fontWeight={"medium"} color={"black"}>
              배송처리
            </Box>
          </Link>
          <Link
            href="/"
            bg={"white"}
            color={"black"}
            borderRadius={"4px"}
            px={"12px"}
            py={"4px"}
            _focus={{ boxShadow: "none", outline: "none" }}
            _hover={{ textDecoration: "none" }}
            border={"1px solid #CCCCCC"}
          >
            홈으로
          </Link>
        </Flex>
        <Box>{children}</Box>
      </Container>
    );
  }

  return null;
}

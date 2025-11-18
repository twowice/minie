"use client";
import { Box, Container } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

export default function PayFailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <Container
      color={"black"}
      bg={"white"}
      display={"flex"}
      flexDirection={"column"}
      maxW="7xl"
      py={"24px"}
      gap={"10px"}
      px={{ base: 4, sm: 6, lg: 8 }}
    >
      <Box>결제에 실패했습니다</Box>
    </Container>
  );
}

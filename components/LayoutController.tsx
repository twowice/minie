"use client";

import { Box, Flex } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutController({
  children,
}: {
  children: React.ReactNode;
}) {
  const HIDDEN_PATHS = [
    "/login",
    "/signup",
    "/payment/tosspayment",
    "/delivery",
  ];
  const pathname = usePathname();

  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

  return (
    <Flex
      flexDirection="column"
      minH="100vh"
      bg="white"
      fontSmooth="antialiased"
    >
      {!shouldHide && <Header />}
      <Box as="main" display="flex" flexDirection="column" flex="1">
        {children}
      </Box>
      {!shouldHide && <Footer />}
    </Flex>
  );
}

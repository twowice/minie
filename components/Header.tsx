"use client";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ShoppingCartDrawer from "./ShoppingCartDrawer";
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Link,
  Text,
  Heading,
  IconButton,
  Collapsible,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/shopping", label: "스킨케어" },
    { href: "/cleansing", label: "클렌징" },
    { href: "/suncare", label: "선케어" },
    { href: "/makeup", label: "메이크업" },
    { href: "/beauty", label: "뷰티소품" },
    { href: "/bodycare", label: "바디케어" },
    { href: "/haircare", label: "헤어케어" },
  ];

  const topBarLinks = [
    { href: "/login", label: "로그인" },
    { href: "/orders", label: "주문조회" },
    { href: "/mypage", label: "마이페이지" },
    { href: "/support", label: "고객센터" },
    { href: "/reviews", label: "리뷰" },
    { href: "/payment", label: "결제" },
    { href: "/inquiry", label: "1:1문의" },
  ];

  return (
    <Box as="header" flexShrink={0} bg="white">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Top bar */}
        <Flex
          display={{ base: "none", md: "flex" }}
          justify="flex-end"
          align="center"
          py={2}
          fontSize="xs"
          color="gray.600"
        >
          {topBarLinks.map((link, index) => (
            <HStack key={link.href} gap={{ base: 2, lg: 3 }}>
              {" "}
              {/* spacing -> gap */}
              <Link as={NextLink} href={link.href} _hover={{ color: "black" }}>
                {link.label}
              </Link>
              {index < topBarLinks.length - 1 && (
                <Text color="gray.300">|</Text>
              )}
            </HStack>
          ))}
        </Flex>

        {/* Main header */}
        <Flex align="center" justify="space-between" py={{ base: 3, md: 4 }}>
          <Link as={NextLink} href="/" _focus={{ boxShadow: "none", outline: "none" }}>
            <Heading
              as="h1"
              fontSize="3xl"
              color="black"
              cursor="pointer"
              fontFamily="CroissantOne, cursive"
            >
              Minié
            </Heading>
          </Link>

          {/* Desktop Navigation */}
          <HStack
            as="nav"
            display={{ base: "none", lg: "flex" }}
            gap={{ base: 8, xl: 14 }} // spacing -> gap
            fontSize={{ base: "base", xl: "base" }}
            color="black"
          >
            {navLinks.map((link) => (
              <Link
                as={NextLink}
                key={link.href}
                href={link.href}
                color={pathname === link.href ? "#FA6D6D" : "inherit"}
                fontWeight={pathname === link.href ? "semibold" : "normal"}
                _hover={{ color: "gray.600" }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          {/* Icons */}
          <HStack gap={{ base: 3, md: 4 }} color="black">
            {" "}
            {/* spacing -> gap */}
            <IconButton
              aria-label="메뉴"
              display={{ base: "flex", lg: "none" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              _hover={{ opacity: 0.7 }}
            >
              <HamburgerIcon /> {/* icon prop -> child */}
            </IconButton>
            <ShoppingCartDrawer />
          </HStack>
        </Flex>

        {/* Mobile Navigation Menu */}
        <Collapsible.Root open={isMobileMenuOpen}>
          {" "}
          {/* Collapse -> Collapsible.Root, in -> open */}
          <Collapsible.Content>
            {" "}
            {/* Wrap content */}
            <Box display={{ lg: "none" }} borderTopWidth="1px" py={4}>
              <VStack
                as="nav"
                gap={3}
                align="stretch"
                fontSize="base"
                color="black"
              >
                {" "}
                {/* spacing -> gap */}
                {navLinks.map((link) => (
                  <Link
                    as={NextLink}
                    key={link.href}
                    href={link.href}
                    _hover={{ color: "gray.600" }}
                    py={2}
                  >
                    {link.label}
                  </Link>
                ))}
              </VStack>
              <VStack
                mt={4}
                pt={4}
                borderTopWidth="1px"
                gap={3} // spacing -> gap
                align="stretch"
                fontSize="sm"
                color="gray.600"
              >
                {topBarLinks.map((link) => (
                  <Link
                    as={NextLink}
                    key={link.href}
                    href={link.href}
                    _hover={{ color: "black" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </VStack>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </Container>
    </Box>
  );
}

"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.target.clientHeight);
      }
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const navLinks = [
    // { href: "/shoppingdetail", label: "쇼핑상세" }, // 이 링크를 추가합니다. -> 다시 삭제
    { href: "/skincare", label: "스킨케어" },
    { href: "/cleansing", label: "클렌징" },
    { href: "/suncare", label: "선케어" },
    { href: "/makeup", label: "메이크업" },
    { href: "/beauty", label: "뷰티소품" },
    { href: "/bodycare", label: "바디케어" },
    { href: "/haircare", label: "헤어케어" },
  ];

  const topBarLinks = [
    { href: "/login", label: "로그인" },
    { href: "/signup", label: "회원가입" }, // 2025월 11월 10일 수정 (박영준)
    { href: "/orders", label: "주문조회" },
    { href: "/mypage", label: "마이페이지" },
    { href: "/support", label: "고객센터" },
    { href: "/reviews", label: "리뷰" },
    { href: "/payment", label: "결제" },
    { href: "/inquiry", label: "1:1문의" },
  ];

  return (
    <Box as="header" ref={headerRef} flexShrink={0} bg="white">
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Top bar */}
        <Flex
          display={{ base: "none", md: "flex" }}
          justify="flex-end"
          align="center"
          gap="10px"
          py={2}
          fontSize="xs"
          color="gray.600"
        >
          {topBarLinks.map((link, index) => (
            <HStack key={link.href}>
              {" "}
              <Link
                as={NextLink}
                href={link.href}
                color="black"
                _focus={{ boxShadow: "none", outline: "none" }}
                _hover={{ textDecoration: "none" }}
              >
                {link.label}
              </Link>
              {index < topBarLinks.length - 1 && <Text color="black">|</Text>}
            </HStack>
          ))}
        </Flex>

        {/* Main header */}
        <Flex align="center" justify="space-between" py={{ base: 3, md: 4 }}>
          <Link
            as={NextLink}
            href="/"
            _focus={{ boxShadow: "none", outline: "none" }}
            _hover={{ textDecoration: "none" }}
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
                _focus={{ boxShadow: "none", outline: "none" }}
                color={pathname === link.href ? "#FA6D6D" : "inherit"}
                fontWeight={pathname === link.href ? "semibold" : "normal"}
                _hover={{ color: "gray.600" }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          {/* Icon Menus including mobileNavigationMenu */}
          <HStack gap={{ base: 3, md: 4 }} color="black">
            <IconButton
              aria-label="메뉴"
              display={{ base: "flex", lg: "none" }}
              color={isMobileMenuOpen ? "#FA6D6D" : "black"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <HamburgerIcon />
            </IconButton>
            <ShoppingCartDrawer headerHeight={headerHeight} />
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
                    color={pathname === link.href ? "#FA6D6D" : "inherit"}
                    _focus={{ boxShadow: "none", outline: "none" }}
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
                    color={"black"}
                    _focus={{ boxShadow: "none", outline: "none" }}
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

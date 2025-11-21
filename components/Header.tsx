'use client';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ShoppingCartDrawer from './ShoppingCartDrawer';

// 2025-11-19 session 관리를 위해 추가 (박영준)
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

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
   Button, // 2025-11-19(박영준)
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

export default function Header() {
   const pathname = usePathname();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const headerRef = useRef<HTMLDivElement>(null);
   const [headerHeight, setHeaderHeight] = useState(0);
   const router = useRouter(); // 2025-11-19(박영준)
   const { user, logout } = useUser(); // 2025-11-19(박영준)

   // 'payment/tosspayment일 때 장바구니 변경을 방지 하기 위해서 장바구니 아이콘을 해당 값에 따라 비활성화합니다.
   const hideCart = pathname.startsWith('/payment/tosspayment');

   useEffect(() => {
      const resizeObserver = new ResizeObserver(entries => {
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
   
   useEffect(() => {
      setIsMobileMenuOpen(false);
   }, [pathname]);

   const navLinks = [
      // { href: "/shoppingdetail", label: "쇼핑상세" }, // 이 링크를 추가합니다. -> 다시 삭제
      { href: '/skincare', label: '스킨케어' },
      { href: '/cleansing', label: '클렌징' },
      { href: '/suncare', label: '선케어' },
      { href: '/makeup', label: '메이크업' },
      { href: '/beauty', label: '뷰티소품' },
      { href: '/bodycare', label: '바디케어' },
      { href: '/haircare', label: '헤어케어' },
   ];

   /* 기존 Header
  const topBarLinks = [
    { href: "/login", label: "로그인" },
    { href: "/signup", label: "회원가입" }, // 2025월 11월 10일 수정 (박영준)
    { href: "/orders", label: "주문조회" },
    { href: "/mypage", label: "마이페이지" },
    { href: "/reviews", label: "리뷰" },
    { href: "/payment", label: "결제" },
    { href: "/inquiry", label: "1:1문의" },
  ];
*/

 // 로그인 상태에 따라 다른 링크 보여주기 2025-11-19 시작 (박영준)
  const topBarLinks = user
    ? [
        // 로그인 상태일 때
        { href: "/orders", label: "주문조회" },
        { href: "/mypage", label: "마이페이지" },
        { href: "/reviews", label: "리뷰" },
        { href: "/payment", label: "결제" },
        { href: "/inquiry", label: "1:1문의" },
      ]
    : [
        // 로그아웃 상태일 때
        { href: "/login", label: "로그인" },
        { href: "/signup", label: "회원가입" },
        { href: "/orders", label: "주문조회" },
        { href: "/mypage", label: "마이페이지" },
        { href: "/reviews", label: "리뷰" },
        { href: "/payment", label: "결제" },
        { href: "/inquiry", label: "1:1문의" },
      ];
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
 // 로그인 상태에 따라 다른 링크 보여주기 2025-11-19 끝 (박영준)

   return (
      <Box as="header" ref={headerRef} flexShrink={0} bg="white">
         <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
            {/* Top bar */}
            <Flex
               display={{ base: 'none', md: 'flex' }}
               justify="flex-end"
               align="center"
               gap="10px"
               py={2}
               fontSize="xs"
               color="gray.600"
            >
               {/* 로그인 상태면 사용자 정보 + 로그아웃 버튼 먼저 표시 2025-11-19 시작 (박영준)*/}
               {user && (
                  <>
                     <Text color="black" fontWeight="medium">
                        {user.name}님
                     </Text>
                     <Text color="black">|</Text>
                     <Button
                        variant="ghost"
                        size="xs"
                        color="black"
                        onClick={handleLogout}
                        _hover={{ bg: 'transparent', color: 'gray.600' }}
                        _focus={{ boxShadow: 'none', outline: 'none' }}
                        p={0}
                        h="auto"
                        fontWeight="normal"
                     >
                        로그아웃
                     </Button>
                     <Text color="black">|</Text>
                  </>
               )}
               {/* 로그인 상태면 사용자 정보 + 로그아웃 버튼 먼저 표시 2025-11-19 끝 (박영준)*/}

               {topBarLinks.map((link, index) => (
                  <HStack key={link.href}>
                     {' '}
                     <Link
                        as={NextLink}
                        href={link.href}
                        color="black"
                        _focus={{ boxShadow: 'none', outline: 'none' }}
                        _hover={{ textDecoration: 'none' }}
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
                  _focus={{ boxShadow: 'none', outline: 'none' }}
                  _hover={{ textDecoration: 'none' }}
               >
                  <Heading
                     as="h1"
                     fontSize="24px"
                     color="black"
                     fontWeight="normal"
                     cursor="pointer"
                     fontStyle={'normal'}
                     fontFamily="CroissantOne, cursive"
                  >
                     Minié
                  </Heading>
               </Link>

               {/* Desktop Navigation */}
               <HStack
                  as="nav"
                  display={{ base: 'none', lg: 'flex' }}
                  gap={{ base: 8, xl: 14 }} // spacing -> gap
                  fontSize={{ base: 'base', xl: 'base' }}
                  color="black"
               >
                  {navLinks.map(link => (
                     <Link
                        as={NextLink}
                        key={link.href}
                        href={link.href}
                        _focus={{ boxShadow: 'none', outline: 'none' }}
                        color={pathname === link.href ? '#FA6D6D' : 'inherit'}
                        fontWeight={pathname === link.href ? 'semibold' : 'normal'}
                        _hover={{ color: 'gray.600' }}
                     >
                        {link.label}
                     </Link>
                  ))}
               </HStack>

               {/* Icon Menus including mobileNavigationMenu */}
               <HStack gap={{ base: 3, md: 4 }} color="black">
                  <IconButton
                     aria-label="메뉴"
                     display={{ base: 'flex', lg: 'none' }}
                     color={isMobileMenuOpen ? '#FA6D6D' : 'black'}
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     bgColor={'transparent'}
                  >
                     <HamburgerIcon />
                  </IconButton>
                  {!hideCart && <ShoppingCartDrawer headerHeight={headerHeight} />}
               </HStack>
            </Flex>

            {/* Mobile Navigation Menu */}
            <Collapsible.Root open={isMobileMenuOpen}>
               {' '}
               {/* Collapse -> Collapsible.Root, in -> open */}
               <Collapsible.Content>
                  {' '}
                  {/* Wrap content */}
                  <Box display={{ lg: 'none' }} borderTopWidth="1px" py={4}>
                     {/* 모바일에서도 로그인 상태 표시 시작 2025-11-19 (박영준) */}
                     {user && (
                        <Box mb={4} pb={4} borderBottomWidth="1px">
                           <Flex justify="space-between" align="center">
                              <Text color="black" fontWeight="medium">
                                 {user.name}님
                              </Text>
                              <Button size="sm" variant="outline" onClick={handleLogout} colorScheme="gray">
                                 로그아웃
                              </Button>
                           </Flex>
                        </Box>
                     )}
                     {/* 모바일에서도 로그인 상태 표시 끝 2025-11-19 (박영준) */}

                     <VStack as="nav" gap={3} align="stretch" fontSize="base" color="black">
                        {' '}
                        {/* spacing -> gap */}
                        {navLinks.map(link => (
                           <Link
                              as={NextLink}
                              key={link.href}
                              href={link.href}
                              color={pathname === link.href ? '#FA6D6D' : 'inherit'}
                              _focus={{ boxShadow: 'none', outline: 'none' }}
                              _hover={{ color: 'gray.600' }}
                              py={2}
                              onClick={() => setIsMobileMenuOpen(false)}
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
                        {topBarLinks.map(link => (
                           <Link
                              as={NextLink}
                              key={link.href}
                              href={link.href}
                              color={'black'}
                              _focus={{ boxShadow: 'none', outline: 'none' }}
                              _hover={{ color: 'black' }}
                              onClick={() => setIsMobileMenuOpen(false)}
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

"use client";
import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function HomeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/images/main/mainBg1.jpg",
    "/images/main/mainBg2.jpg",
    "/images/main/mainBg3.jpg",
    "/images/main/mainBg4.jpg",
    "/images/main/mainBg5.jpg",
  ];
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <Box
      as="section"
      position="relative"
      w="full"
      flexGrow={1}
      h={{ base: "200px", sm: "300px", md: "400px", lg: "500px" }}
    >
      <Box position="relative" w="full" h="full" overflow="hidden">
        {slides.map((slide, index) => (
          <Box
            key={index}
            position="absolute"
            inset="0"
            transition="opacity 0.7s ease-in-out"
            opacity={index === currentSlide ? 1 : 0}
            bgImage={`url(${slide})`}
            bgSize="cover"
            backgroundPosition="center"
            bgRepeat="no-repeat"
          />
        ))}

        {/* 이전 버튼 */}
        <IconButton
          onClick={prevSlide}
          aria-label="이전 슬라이드"
          position="absolute"
          left={{ base: 4, sm: 6, md: 8 }}
          top="50%"
          transform="translateY(-50%)"
          bgColor="whiteAlpha.900"
          _hover={{ bgColor: "white" }}
          borderRadius="full"
          size={{ base: "sm", sm: "md", md: "lg" }}
          shadow="xl"
          transition="all 0.2s"
          zIndex="docked"
          color={"black"}
        >
          <ChevronLeftIcon
            w={{ base: 4, sm: 5, md: 6 }}
            h={{ base: 4, sm: 5, md: 6 }}
          />
        </IconButton>

        {/* 다음 버튼 */}
        <IconButton
          onClick={nextSlide}
          aria-label="다음 슬라이드"
          position="absolute"
          right={{ base: 4, sm: 6, md: 8 }}
          top="50%"
          transform="translateY(-50%)"
          bgColor="whiteAlpha.900"
          _hover={{ bgColor: "white" }}
          borderRadius="full"
          size={{ base: "sm", sm: "md", md: "lg" }}
          shadow="xl"
          transition="all 0.2s"
          zIndex="docked"
          color={"black"}
        >
          <ChevronRightIcon
            w={{ base: 4, sm: 5, md: 6 }}
            h={{ base: 4, sm: 5, md: 6 }}
          />
        </IconButton>

        {/* 슬라이드 인디케이터 */}
        <Box
          position="absolute"
          bottom={{ base: 4, sm: 6, md: 8 }}
          left="50%"
          transform="translateX(-50%)"
          bgColor="whiteAlpha.900"
          px={{ base: 3, sm: 4 }}
          py={{ base: 1, sm: 2 }}
          borderRadius="full"
          shadow="lg"
          zIndex="docked"
        >
          <Text
            as="span"
            fontSize={{ base: "xs", sm: "sm" }}
            fontWeight="semibold"
            color="black"
          >
            {String(currentSlide + 1).padStart(2, "0")}
          </Text>
          <Text as="span" fontSize={{ base: "xs", sm: "sm" }} color="gray.600">
            {" "}
            / {String(totalSlides).padStart(2, "0")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

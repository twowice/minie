"use client";
import { Box, VStack, Text } from "@chakra-ui/react";

export default function BottomDiaTwo() {
  // 예시 알람 데이터
  const notifications = Array.from({ length: 20 }, (_, i) => `알람 항목 #${i + 1}`);

  return (
    <Box
      w="100%"
      h="400px"
      overflowY="auto"
      borderRadius="10px"
      bg="white"
      paddingRight="10px"
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#ccc",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#aaa",
        },
      }}
    >
      <VStack align="stretch">
        {notifications.map((item, idx) => (
          <Box
            key={idx}
            p="8px 12px"
            borderRadius="8px"
            bg="#f5f5f5"
          >
            <Text fontSize="14px" color="black">{item}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

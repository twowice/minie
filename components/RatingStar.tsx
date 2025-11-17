"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface RatingStatsProps {
  rating: { [key: number]: number };
}

export default function RatingStats({ rating = {} }: RatingStatsProps) {
  const ratingEntries = Object.entries(rating);

  // rating 객체가 비어있으면 아무것도 렌더링하지 않습니다.
  if (ratingEntries.length === 0) {
    return null;
  }

  const totalCount = ratingEntries.reduce((acc, [, count]) => acc + count, 0);
  return (
    <Flex
      w="100%"
      p="20px 0"
      color="black"
      gap={"30px"}
      borderBottom={"1px solid rgba(204,204,204,0.8)"}
    >
      {ratingEntries
        .sort(([scoreA], [scoreB]) => Number(scoreB) - Number(scoreA)) // 5점 → 1점 순서
        .map(([score, count]) => {
          const widthPercent = totalCount > 0 ? (count / totalCount) * 100 : 0;

          return (
            <Flex
              key={score}
              alignItems="center"
              justifyContent={"center"}
              direction={"column"}
              gap={"5px"}
            >
              {/* 막대 */}
              <Box
                h="100px"
                w={"12px"}
                bg="rgba(0,0,0,0.1)"
                overflow="hidden"
                borderRadius="12px"
                position={"relative"}
              >
                <Box
                  borderRadius="12px"
                  bg="#FA6D6D"
                  w={"100%"}
                  h={`${widthPercent}%`}
                  transition="width 0.3s"
                  bottom={0}
                  position={"absolute"}
                />
              </Box>

              {/* 점수 */}
              <Text w={"40px"} color={"#5c5c5c"}>
                {score}점
              </Text>
            </Flex>
          );
        })}
    </Flex>
  );
}

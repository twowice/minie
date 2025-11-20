import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Image,
  NativeSelect,
  NativeSelectIndicator,
  Text,
} from "@chakra-ui/react";
import RatingStar from "@/components/RatingStar";
import ReviewItem from "./ReviewItem";

export default function ReviewChart({ reviews }: { reviews: any }) {
  return (
    <Box>
      <Box>
        <HStack
          p={"20px 0"}
          color={"black"}
          justifyContent={"space-between"}
          alignItems={"center"}
          borderBottom={"1px solid #cccccc"}
        >
          <Text fontSize={"24px"} fontWeight={"700"}>
            상품 리뷰
          </Text>
          <Text fontSize={"16px"}>
            <strong>{reviews.length}</strong> 개의 리뷰
          </Text>
        </HStack>
      </Box>
      <RatingStar rating={{ 5: 14, 4: 8, 3: 3, 2: 1, 1: 2 }} />
      <Flex
        p={"8px 0"}
        alignItems={"center"}
        justifyContent={"space-between"}
        fontSize={"12px"}
      >
        <NativeSelect.Root size={"xs"} w={"60px"} variant={"plain"}>
          <NativeSelect.Field
            padding={"2px 4px"}
            h={"24px"}
            color={"black"}
            defaultValue={"최신 순"}
          >
            <option value="최신 순">최신 순</option>
            <option
              value="별점순"
              // onChange={() => setReview().sort((a, b) => a - b)}
            >
              별점 순
            </option>
          </NativeSelect.Field>
          <NativeSelectIndicator />
        </NativeSelect.Root>
        <Flex gap={"10px"} color={"#4A4A4A"}>
          <Button
            p={0}
            h={"30px"}
            w={"80px"}
            bg={"transparent"}
            fontSize={"12px"}
            color={"#4A4A4A"}
            borderLeft={"1px solid rgba(204,204,204,0.8)"}
          >
            검색 필터
          </Button>
          <Checkbox.Root
            w={"full"}
            variant={"solid"}
            colorPalette={"red"}
            // checked={filterPrice.includes(20000)}
            // onCheckedChange={() => togglePrice(20000)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label fontSize={"12px"}>포토 리뷰</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root
            w={"full"}
            variant={"solid"}
            colorPalette={"red"}
            // checked={filterPrice.includes(20000)}
            // onCheckedChange={() => togglePrice(20000)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label fontSize={"12px"}>일반 리뷰</Checkbox.Label>
          </Checkbox.Root>
        </Flex>
      </Flex>
      <Flex gap={"20px"} p={"20px 0"} direction={"column"}>
        <ReviewItem />
        <Flex w={"100%"} justifyContent={"space-between"}>
          <Flex gap={"30px"}>
            <Box>
              <Avatar.Root size={"2xl"} mb={"10px"}>
                <Avatar.Fallback name="불타는 스킨" />
                <Avatar.Image src={"/images/test/파이리.jpeg"} alt="파이리" />
              </Avatar.Root>
              <Text fontWeight={"500"} color={"black"} fontSize={"12px"}>
                불타는 스킨
              </Text>
            </Box>
            <Flex
              direction={"column"}
              textAlign={"left"}
              fontSize={"12px"}
              color={"#5C5C5C"}
              gap={"10px"}
            >
              <Text fontWeight={"500"}>2025.10.23</Text>
              <Text color={"#A8A8A8"}>타임 리페어 인테시브 크림</Text>
              <Box>
                <Text>
                  악건성이라 그냥 기름 뜨는 쿠션 말고 보습감 있는 촉촉한 쿠션
                  좋아하는데 제가 원하던 느낌에 얇고 가볍게 올라가서 좋았어욤
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Button
            border={"1px solid #cccccc"}
            w={"100px"}
            p={"0"}
            fontSize={"12px"}
            h={"30px"}
          >
            답변
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

"use client";

import { Box, Text, HStack, VStack, Flex, Portal, Select, createListCollection, Checkbox, Image, Dialog, Button, CloseButton, ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import ReviewTextDialog from "@/components/ReviewTextDialog";

// Dummy DATA
const reviewTotalData = {
    totalCount: 60200,
    score: 4.5,
    distribution: {
        5: 60,
        4: 25,
        3: 10,
        2: 4,
        1: 1,
    },
};

const reviewNoticeData = [
    {
        id: 1,
        userName: "따가운 볼",
        userImage: "/images/review/profile1.png",
        createdAt: "2025.10.23",
        score: 4.5,
        productName: "[신상/블랙에디션/리뷰이벤트] 파넬 시카마누 세럼쿠션(미니/단품/기획)",
        reviewText: "아이가 아주 만족해하며 잘 쓰고있어요 피부에 밀착력이 좋고 커버가 잘된다고 해요♡",
        productImage: "images/review/product1.png",
    },
    {
        id: 2,
        userName: "불타는 스킨",
        userImage: "/images/review/profile2.png",
        createdAt: "2025.10.22",
        score: 2.5,
        productName: "[1위 광채쿠션] 파넬 세럼 인 하이글로우 쿠션 (본품+리필)",
        reviewText: "악건성이라 그냥 기름 뜨는 쿠션 말고 보습감 있는 촉촉한 쿠션 좋아하는데 제가 원하던 느낌에 얇고 가볍게 올라가서 좋았어욤",
        productImage: "images/review/product2.jpg",
    },
    {
        id: 3,
        userName: "불타는 스킨",
        userImage: "/images/review/profile2.png",
        createdAt: "2025.10.22",
        score: 3.0,
        productName: "[1위 광채쿠션] 파넬 세럼 인 하이글로우 쿠션 (본품+리필)",
        reviewText: "악건성이라 그냥 기름 뜨는 쿠션 말고 보습감 있는 촉촉한 쿠션 좋아하는데 제가 원하던 느낌에 얇고 가볍게 올라가서 좋았어욤",
        productImage: "images/review/product2.jpg",
    },
]

export default function Page() {
    /* SCORE */
    const fullStars = Math.floor(reviewTotalData.score);
    const hasHalfStar = reviewTotalData.score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    /* SELECT */
    const frameworks = createListCollection({
        items: [
            { label: "최신 순", value: "recent" },
            { label: "별점 순", value: "score" },
        ],
    })

    return (
        <Box px="40px" py="24px">
            {/* 헤더 */}
            <Text fontSize="14px" mb={1} color="black">
                상품 리뷰
            </Text>
            <Text fontSize="16px" color="black" pb="20px" borderBottom="1px solid #D8D8D8">
                <Text as="span" fontSize="32px" fontWeight="bold" color="black">
                    {reviewTotalData.totalCount.toLocaleString()}
                </Text>
                {" "}개의 리뷰
            </Text>

            {/* 점수 통계 */}
            <HStack h="42px" py="5px" paddingTop="10px">
                <Text fontSize="16px" color="black" paddingRight="10px">
                    <Text as="span" fontSize="32px" fontWeight="bold" color="black">
                        {reviewTotalData.score.toFixed(1)}
                    </Text>
                    {" "}점
                </Text>

                <HStack>
                    {Array(fullStars)
                        .fill(0)
                        .map((_, i) => (
                            <Text key={`full-${i}`} color="yellow.400" fontSize="32px">
                                ★
                            </Text>
                        ))}
                    {hasHalfStar && (
                        <Text key="half" color="yellow.400" fontSize="32px">
                            ⯨
                        </Text>
                    )}
                    {Array(emptyStars)
                        .fill(0)
                        .map((_, i) => (
                            <Text key={`empty-${i}`} color="gray.300" fontSize="32px">
                                ★
                            </Text>
                        ))}
                </HStack>
            </HStack>

            <Flex gap="20px" alignItems="flex-end" h="176px" borderBottom="1px solid #D8D8D8" py="15px">
                {Object.entries(reviewTotalData.distribution)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([star, percent]) => (
                        <VStack key={star}>
                            <Box
                                w="12px"
                                h="98px"
                                bg="#E3E3E3"
                                borderRadius="10px"
                                overflow="hidden"
                                display="flex"
                                flexDirection="column-reverse"
                            >
                                <Box
                                    w="100%"
                                    h={`${percent}%`}
                                    bg="#FA6D6D"
                                    borderRadius="10px 10px 0 0"
                                />
                            </Box>
                            <Text fontSize="13px" color="#5C5C5C">
                                {star}점
                            </Text>
                        </VStack>
                    ))
                }
            </Flex>

            {/* 게시판 필터 */}
            <Flex
                justifyContent="space-between"
                alignItems="center"
                py="15px"
            >
                <Select.Root collection={frameworks} size="sm" width="87px" height="30px">
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText fontSize="12px" color="#000000" placeholder="최신 순"></Select.ValueText>
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content bg="#cccccc20" color="black">
                                {frameworks.items.map((framework) => (
                                    <Select.Item bg="#ececec20" item={framework} key={framework.value} fontSize="12px">
                                        {framework.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Flex alignItems="center" gap="10px">
                    <Text color="#4A4A4A"
                        borderLeft="1px solid #D8D8D8"
                        paddingLeft="5px"
                        fontSize="13px"
                        width="80px"
                        height="30px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        검색 필터
                    </Text>
                    <Checkbox.Root invalid>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color="#4A4A4A" fontSize="13px">포토 리뷰</Checkbox.Label>
                    </Checkbox.Root>
                    <Checkbox.Root invalid>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color="#4A4A4A" fontSize="13px">일반 리뷰</Checkbox.Label>
                    </Checkbox.Root>
                </Flex>
            </Flex>

            {/* 게시판 컨텐츠 */}
            <VStack mt="20px" align="stretch">
                {reviewNoticeData.map((review) => (

                    <Dialog.Root key={review.id}>
                        <Flex key={review.id} borderBottom="1px solid #E3E3E3" p="16px" gap="30px" borderRadius="5px">
                            <VStack align="center" w="80px">
                                <Image
                                    src={review.userImage}
                                    alt={review.userName}
                                    boxSize="83px"
                                    borderRadius="50%"
                                    objectFit="cover"
                                />
                                <Text fontSize="13px" fontWeight="bold" color="black">
                                    {review.userName}
                                </Text>
                            </VStack>

                            <VStack align="stretch" flex="1">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Text fontSize="12px" color="#5C5C5C">
                                        {review.createdAt}
                                    </Text>
                                    <HStack>
                                        {Array(Math.floor(review.score))
                                            .fill(0)
                                            .map((_, i) => (
                                                <Text key={`full-${i}`} color="yellow.400" fontSize="19px">
                                                    ★
                                                </Text>
                                            ))}
                                        {review.score % 1 >= 0.5 && (
                                            <Text color="yellow.400" fontSize="19px">
                                                ⯨
                                            </Text>
                                        )}
                                        {Array(5 - Math.ceil(review.score))
                                            .fill(0)
                                            .map((_, i) => (
                                                <Text key={`empty-${i}`} color="gray.300" fontSize="19px">
                                                    ★
                                                </Text>
                                            ))}
                                    </HStack>
                                </Flex>

                                <Text fontSize="12px" color="#A8A8A8">
                                    {review.productName}
                                </Text>

                                <ReviewTextDialog
                                    reviewProductName={review.productName}
                                    reviewText={review.reviewText}
                                    productName={review.productName}
                                    productImage={review.productImage}
                                    reviewScore={review.score}
                                />

                                <Dialog.Trigger asChild>
                                    <Box position="relative" display="inline-block" w="100px" h="100px">
                                        {/* 리뷰 이미지 */}
                                        <Image
                                            src={review.productImage}
                                            alt={review.productName}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="8px"
                                            cursor="pointer"
                                            _hover={{ opacity: 0.8 }}
                                        />

                                        <Button
                                            position="absolute"
                                            bottom="4px"
                                            right="4px"
                                            size="sm"
                                            borderRadius="50%"
                                            w="24px"
                                            h="24px"
                                            minW="0"
                                            p="0"
                                            bg="black"
                                            color="white"
                                            fontWeight="bold"
                                            _hover={{ bg: "gray.800" }}
                                        >
                                            +
                                        </Button>
                                    </Box>

                                </Dialog.Trigger>
                            </VStack>
                        </Flex>

                        <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content bg="#f9f9f9">
                                    <Dialog.Header>
                                        <Dialog.Title color="black" fontWeight="bold">자세히 보기</Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
                                        <Image
                                            src={review.productImage}
                                            alt={review.productName}
                                            w="100%"
                                            borderRadius="10px"
                                            objectFit="cover"
                                        />
                                    </Dialog.Body>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" color="black" _hover={{ bg: "#f9f9f9" }} />
                                    </Dialog.CloseTrigger>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
                ))}
            </VStack>
            <Flex justify="center" mt="20px">
                <Pagination.Root count={20} pageSize={2} defaultPage={1}>
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild >
                            <IconButton>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items  
                            render={(page) => (
                                <IconButton variant={{ base: "ghost", _selected: "outline" }} color="#929292ff" _hover={{ color: "#ffffffff" }}>
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Flex>
        </Box>
    );
}

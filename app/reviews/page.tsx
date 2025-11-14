"use client";

import { useState, useMemo, useEffect } from "react";
import { Spinner, Box, Text, HStack, VStack, Flex, Portal, NativeSelect, NativeSelectIndicator, createListCollection, Checkbox, Image, Dialog, Button, CloseButton, ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import ContentDialog from "@/components/ContentDialog";

export default function Page() {
    /* FETCH DATA */
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewTotalData, setReviewTotal] = useState<{ totalCount: number; rating: number; distribution: Record<number, number> }>
        ({
            totalCount: 0,
            rating: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/reviews?page=${page}&pageSize=${pageSize}`);
                const result = await res.json();

                if (res.ok && result.data) {
                    setReviews(result.data);
                    setReviewTotal({
                        totalCount: result.totalCount,
                        rating: result.rating,
                        distribution: result.distribution
                    })
                } else {
                    console.error("리뷰 불러오기 실패:", result.message || result.error);
                }
            } catch (e) {
                console.error("서버 연결 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [page]);

    /* rating */
    const fullStars = Math.floor(reviewTotalData.rating);
    const hasHalfStar = reviewTotalData.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    /* SORT */
    const [sortType, setSortType] = useState<"latest" | "rating">("latest");
    const [photoFilter, setPhotoFilter] = useState(false);
    const [normalFilter, setNormalFilter] = useState(false);
    const sortedReviews = useMemo(() => {
        console.log(reviews);
        return [...reviews]
            .filter((review) => {
                if (photoFilter && !normalFilter) return review.products.image;
                if (!photoFilter && normalFilter) return !review.products.image;
                return true;
            })
            .sort((a, b) => {
                if (sortType === "latest") {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else return b.rating - a.rating;
            });
    }, [reviews, sortType, photoFilter, normalFilter]);

    if (loading) {
        return (
            <VStack colorPalette="pink">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">불러오는 중...</Text>
            </VStack>
        );
    }

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
                        {reviewTotalData.rating.toFixed(1)}
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

                <NativeSelect.Root size={'xs'} w={'60px'} variant={'plain'}>
                    <NativeSelect.Field
                        padding={'2px 4px'}
                        h={'24px'}
                        color={'rgba(0, 0, 0, 0.7)'}
                        value={sortType === "latest" ? "최신 순" : "별점 순"}
                        onChange={(e) => setSortType(e.target.value === "최신 순" ? "latest" : "rating")}
                    >
                        <option value="최신 순" defaultChecked style={{ backgroundColor: "#ffffff" }} >
                            최신 순
                        </option>
                        <option value="별점 순" style={{ backgroundColor: "#ffffff" }}>별점 순</option>
                    </NativeSelect.Field>
                    <NativeSelectIndicator />
                </NativeSelect.Root>
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
                    <Checkbox.Root colorPalette={"red"} checked={photoFilter} onCheckedChange={(e) => setPhotoFilter(!!e.checked)}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color="#4A4A4A" fontSize="13px">포토 리뷰</Checkbox.Label>
                    </Checkbox.Root>
                    <Checkbox.Root colorPalette={"red"} checked={normalFilter} onCheckedChange={(e) => setNormalFilter(!!e.checked)}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color="#4A4A4A" fontSize="13px">일반 리뷰</Checkbox.Label>
                    </Checkbox.Root>
                </Flex>
            </Flex>

            {/* 게시판 컨텐츠 */}
            <VStack mt="20px" align="stretch">
                {sortedReviews.map((review) => (
                    <Dialog.Root key={review.id}>
                        <Flex key={review.id} borderBottom="1px solid #E3E3E3" p="16px" gap="30px" borderRadius="5px">
                            <VStack align="center" w="80px">
                                <Image
                                    src={review.users.profile_image}
                                    alt={review.users.name}
                                    boxSize="83px"
                                    borderRadius="50%"
                                    objectFit="cover"
                                />
                                <Text fontSize="13px" fontWeight="bold" color="black">
                                    {review.users.name}
                                </Text>
                            </VStack>

                            <VStack align="stretch" flex="1">
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Text fontSize="12px" color="#5C5C5C">
                                        {new Date(review.created_at).toISOString().split("T")[0]}
                                    </Text>
                                    <HStack>
                                        {Array(Math.floor(review.rating))
                                            .fill(0)
                                            .map((_, i) => (
                                                <Text key={`full-${i}`} color="yellow.400" fontSize="19px">
                                                    ★
                                                </Text>
                                            ))}
                                        {review.rating % 1 >= 0.5 && (
                                            <Text color="yellow.400" fontSize="19px">
                                                ⯨
                                            </Text>
                                        )}
                                        {Array(5 - Math.ceil(review.rating))
                                            .fill(0)
                                            .map((_, i) => (
                                                <Text key={`empty-${i}`} color="gray.300" fontSize="19px">
                                                    ★
                                                </Text>
                                            ))}
                                    </HStack>
                                </Flex>

                                <Text fontSize="12px" color="#A8A8A8">
                                    {review.products.name}
                                </Text>

                                <ContentDialog
                                    reviewProductName={review.products.name}
                                    content={review.content}
                                    productName={review.products.name}
                                    productImage={review.products.image}
                                    reviewrating={review.rating}
                                    userId={review.user_id}
                                    productId={review.product_id}
                                    id={review.id}
                                />

                                {review.image_url && (
                                    <Dialog.Trigger asChild>
                                        <Box position="relative" display="inline-block" w="100px" h="100px">
                                            {/* 리뷰 이미지 */}
                                            <Image
                                                src={review.image_url}
                                                alt={review.image_url}
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
                                )}
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
                                            src={review.products.image}
                                            alt={review.products.name}
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
                <Pagination.Root count={Math.ceil(reviewTotalData.totalCount)} pageSize={5} page={page} defaultPage={1} m={'0 auto'} w={'100%'} textAlign={'center'} p={'4'}>
                    <ButtonGroup variant="ghost" size="sm">
                        <Pagination.PrevTrigger asChild color={'black'}>
                            <IconButton _hover={{ color: 'white' }}>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>
                        <Pagination.Items
                            color='black'
                            render={(page) => (
                                <IconButton key={page.value} onClick={() => setPage(page.value)} variant={{ base: 'ghost', _selected: 'outline' }} _hover={{ color: 'white' }}>{page.value}</IconButton>
                            )}
                        />
                        <Pagination.NextTrigger asChild color={'black'}>
                            <IconButton _hover={{ color: 'white' }}>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Flex>
        </Box>
    );
}

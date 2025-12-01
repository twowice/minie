"use client";

import { Text, Portal, CloseButton, Dialog, Button, Image, Flex, VStack, HStack, Box, Textarea } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { fetchWithAuth } from "@/lib/minie/authAPI";

interface reviewDialogProps {
    content: string;
    reviewImage: string;
    productName: string;
    productImage: string;
    reviewrating: number;
    userId: string;
    loginUserId: number | undefined;
    productId: string;
    id: string;
    onUpdate?: () => void;
    onSuccess?: () => void;
    onFail?: () => void;
    onDelSuccess?: () => void;
    onDelFail?: () => void;
}

export default function reviewDialogDialog({ id, content, reviewImage, productName, productImage, reviewrating, userId, loginUserId, productId, onUpdate, onSuccess, onFail, onDelSuccess, onDelFail }: reviewDialogProps) {
    /* 별점 & 설명 & 리뷰사진 & 닫기 */
    const [rating, setRating] = useState(reviewrating);
    const [contentContent, setcontentContent] = useState(content);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDelSubmitting, setIsDelSubmitting] = useState(false);

    /* 별점 동작 */
    const handleStarClick = (
        e: React.MouseEvent<HTMLDivElement>,
        index: number
    ) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - left;
        const newRating = clickX < width / 2 ? index - 0.5 : index;
        setRating(newRating);
    };

    /* 저장 */
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("rating", rating.toString());
        formData.append("content", contentContent);
        formData.append("user_id", userId);
        formData.append("product_id", productId);

        /* 이미지 URL */
        if (photoURL === null) formData.append("imageUrl", "");
        else formData.append("imageUrl", reviewImage);

        /* 이미지 FILE */
        if (photo) formData.append("image", photo);

        console.log("=== FormData 내용 ===");
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) console.log(`${key}: [파일] ${value.name}, ${value.size} bytes`);
            else console.log(`${key}: ${value}`);
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        /* REQUEST */
        try {
            const res = await fetchWithAuth("/api/reviews", {
                method: "POST",
                body: formData
            });

            const result = await res.json();
            console.log("서버 응답:", result);

            if (result.message === "리뷰 수정 성공") {
                closeBtnRef.current?.click();
                onSuccess?.();
                onUpdate?.();
            }
        } catch (e) { console.error("에러:", e); onFail?.(); }
        finally { setIsSubmitting(false) };
    }

    /* 삭제 */
    const handleDel = async () => {
        if (isDelSubmitting) return;
        setIsDelSubmitting(true);
        try {
            const res = await fetchWithAuth(`/api/reviews?id=${id}`, {
                method: "DELETE",
            });

            const result = await res.json();
            console.log("서버 응답:", result);

            if (result.message === "리뷰 삭제 성공") {
                closeBtnRef.current?.click();
                onDelSuccess?.();
                onUpdate?.();
            }
        } catch (e) { console.error("에러:", e); onDelFail?.(); }
        finally { setIsDelSubmitting(false) };
    }

    return (
        <Dialog.Root
            onOpenChange={(open) => {
                if (open) {
                    setRating(reviewrating);
                    setPhoto(null);
                    setPhotoURL(reviewImage || null);
                    setcontentContent(content);
                }
            }}>

            {String(userId) === String(loginUserId) ? (
                <Dialog.Trigger asChild>
                    <Text
                        textAlign="left"
                        fontSize="12px"
                        color="#5C5C5C"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                    >
                        {content}
                    </Text>
                </Dialog.Trigger>
            ) : (
                <Text
                    textAlign="left"
                    fontSize="12px"
                    color="#8E8E8E"
                    cursor="not-allowed"
                    onClick={(e) => e.preventDefault()}
                >
                    {content}
                </Text>
            )}

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        bg="#f9f9f9"
                        borderRadius="10px"
                        p="20px"
                        w="600px"
                        maxW="90%"
                        h="70%"
                        maxH="90%"
                    >
                        {/* 헤더 */}
                        <Dialog.Header p="0" paddingTop="8px" paddingBottom="8px">
                            <Dialog.Title color="#000000" fontSize="20px" fontWeight="Medium">
                                리뷰 작성
                            </Dialog.Title>
                        </Dialog.Header>

                        {/* 바디 */}
                        <Dialog.Body borderTop="1px solid #CCCCCC" padding="0px" overflowY="auto" paddingRight="7px"
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "5px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "#f1f1f1",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#c7c7c7ff",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "#a0a0a0",
                                },
                            }}
                        >
                            <Flex gap="16px" alignItems="flex-start" borderBottom="1px solid #CCCCCC" padding="8px">
                                {productImage ? (
                                    <Image
                                        src={productImage}
                                        alt={productName}
                                        boxSize="130px"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Box
                                        boxSize="130px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        border="1px solid #CCCCCC"
                                        borderRadius="5px"
                                        bg="#f5f5f5"
                                    >
                                        <Text fontSize="12px" color="#999999" textAlign="center">
                                            이미지 없음
                                        </Text>
                                    </Box>
                                )}
                                <VStack align="start">
                                    <Text fontSize="14px" fontWeight="Medium" color="#000000" whiteSpace="pre-wrap" p="8px">
                                        {productName.replace(/]\s*/g, ']\n')}
                                    </Text>
                                </VStack>
                            </Flex>

                            <Flex justify="flex-start" align="center" gap="16px" paddingTop="16px">
                                <Text
                                    fontSize="14px"
                                    fontWeight="bold"
                                    color="#000000">
                                    상품은 어떠셨나요?
                                </Text>

                                <HStack justify="center" align="center">
                                    {[1, 2, 3, 4, 5].map((i) => {
                                        const isHalf = rating >= i - 0.5 && rating < i;
                                        const isFull = rating >= i;

                                        return (
                                            <Box
                                                key={i}
                                                cursor="pointer"
                                                onClick={(e) => handleStarClick(e, i)}
                                                width="32px"
                                                height="32px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                position="relative"
                                            >
                                                <Text fontSize="32px" color="gray.300" userSelect="none" lineHeight="1">
                                                    ★
                                                </Text>

                                                {(isFull || isHalf) && (
                                                    <Text
                                                        fontSize="32px"
                                                        color="yellow.400"
                                                        userSelect="none"
                                                        lineHeight="1"
                                                        position="absolute"
                                                        top="0"
                                                        left="0"
                                                        width={isHalf ? "50%" : "100%"}
                                                        overflow="hidden"
                                                        clipPath={isHalf ? "inset(0 0 0 0)" : "none"}
                                                    >
                                                        ★
                                                    </Text>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </HStack>
                            </Flex>

                            <Flex direction="column" w="100%" gap="8px" mt="16px">
                                <Text fontSize="14px" fontWeight="bold" color="#000000">
                                    어떤 점이 좋았나요?
                                </Text>
                                <Textarea
                                    placeholder="꿀팁 가득, 상세한 리뷰를 작성해 보세요!(500자 이내)"
                                    size="sm"
                                    resize="none"
                                    w="100%"
                                    minH="150px"
                                    flex="1"
                                    border="1px solid #929292"
                                    color="black"
                                    maxLength={500}
                                    value={contentContent}
                                    onChange={(e) => setcontentContent(e.target.value)}
                                />
                            </Flex>

                            <Flex direction="column" w="100%" gap="8px" mt="16px">
                                <Text fontSize="14px" fontWeight="bold" color="#000000">
                                    포토
                                </Text>
                                <input
                                    type="file"
                                    id="photo-upload"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setPhoto(file);
                                            setPhotoURL(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {photoURL ? (
                                    <Box position="relative" width="80px" height="80px">
                                        <Image
                                            src={photoURL}
                                            alt="리뷰 사진"
                                            boxSize="80px"
                                            borderRadius="3px"
                                            objectFit="cover"
                                            cursor="pointer"
                                            onClick={() => document.getElementById('photo-upload')?.click()}
                                        />
                                        <CloseButton
                                            w="18px"
                                            h="18px"
                                            minW="18px"
                                            minH="18px"
                                            position="absolute"
                                            top="0px"
                                            right="0px"
                                            bg="red"
                                            borderRadius="full"
                                            onClick={() => {
                                                setPhoto(null);
                                                setPhotoURL(null);
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Button
                                        w="80px"
                                        h="80px"
                                        border="1px solid #B5B5B5"
                                        borderRadius="3px"
                                        fontSize="16px"
                                        color="#B5B5B5"
                                        _hover={{ bg: "#f1f1f1" }}
                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                    >
                                        +
                                    </Button>
                                )}
                                <Text color="#adadadff" fontSize="12px">
                                    사진은 10MB이하의 PNG, GIF, JPG 파일만 등록 가능합니다.
                                </Text>
                            </Flex>
                        </Dialog.Body>

                        {/* 푸터 */}
                        <Dialog.Footer p="0" paddingTop="10px">
                            <Flex w="100%" gap="8px">
                                <Button flex="1" bg="#FFFFFF" border="1px solid #cececeff" borderRadius="4px" fontSize="16px" color="#000000" _hover={{ bg: "#f5f5f5", borderColor: "#bfbfbf" }} onClick={handleDel} disabled={isDelSubmitting}>{isDelSubmitting ? "삭제 중..." : "삭제"}</Button>
                                <Button flex="1" bg="#FA6D6D" borderRadius="4px" fontSize="16px" color="#FFFFFF" _hover={{ bg: "#ff8e8eff" }} onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? "저장 중..." : "저장"}</Button>
                            </Flex>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" mt="10px" color="black" _hover={{ bg: "#f9f9f9" }} ref={closeBtnRef} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

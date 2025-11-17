"use client";

import { useState } from "react";
import {
    Container,
    Text,
    HStack,
    VStack,
    Textarea,
    Button,
    CloseButton,
    Box,
    Image,
    Input,
    NativeSelect,
    NativeSelectIndicator,
    Flex,
} from "@chakra-ui/react";

export default function Page() {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);

    return (
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
            <Text fontSize={{ base: "24px", md: "32px" }} fontWeight="semibold" color="#000000" mb={4}>
                1:1 문의
            </Text>

            <VStack align="stretch">
                {/* 문의 유형 */}
                <Flex direction={{ base: "column", md: "row" }} align="left" gap={4}>
                    <Text minW={{ md: "200px" }} fontSize="20px" fontWeight="bold" color="#000000">
                        문의 유형
                    </Text>
                    <NativeSelect.Root w={{ base: "100%", md: "200px" }} h="36px" padding="5px 0px" border="1px solid lightgray" borderRadius="4px" variant="plain">
                        <NativeSelect.Field fontSize="14px" color="#898989" fontWeight="light" defaultValue="" h="24px">
                            <option value="" style={{ backgroundColor: "#F3F3F3" }}>카테고리를 선택해주세요</option>
                            <option value="온라인 몰" style={{ backgroundColor: "#F3F3F3" }}>온라인 몰</option>
                            <option value="오프라인 몰" style={{ backgroundColor: "#F3F3F3" }}>오프라인 몰</option>
                            <option value="신고 / 제보" style={{ backgroundColor: "#F3F3F3" }}>신고 / 제보</option>
                        </NativeSelect.Field>
                        <NativeSelectIndicator />
                    </NativeSelect.Root>
                </Flex>

                {/* 내용 */}
                <Flex direction={{ base: "column", md: "row" }} align="flex-start" gap={4}>
                    <Text minW={{ md: "200px" }} fontSize="20px" fontWeight="bold" color="#000000">
                        내용
                    </Text>
                    <VStack w="full" align="flex-start">
                        <Textarea
                            w="full"
                            h={{ base: "200px", md: "400px" }}
                            border="0.5px solid lightgray"
                            borderRadius="4px"
                            fontSize="14px"
                            p="12px"
                            placeholder="문의 내용을 입력해주세요. (2000자 이내)"
                            _placeholder={{ color: "#898989" }}
                            resize="none"
                            color="#000000"
                        />

                        <Text fontSize="14px" fontWeight="light" color="#898989">
                            이미지파일 (JPG, PNG, GIF) 총 3장을 첨부할 수 있어요.
                        </Text>

                        {/* 파일 업로드 input */}
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setPhoto(file);
                                setPhotoURL(URL.createObjectURL(file));
                            }}
                        />

                        {/* 업로드 버튼 / 이미지 미리보기 */}
                        <Box>
                            {!photoURL ? (
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
                            ) : (
                                <Box position="relative" w="80px" h="80px">
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
                                        size="sm"
                                        position="absolute"
                                        top="0"
                                        right="0"
                                        bg="red"
                                        borderRadius="full"
                                        onClick={() => {
                                            setPhoto(null);
                                            setPhotoURL(null);
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </VStack>
                </Flex>

                {/* 이메일 */}
                <Flex direction={{ base: "column", md: "row" }} align="left" gap={4}>
                    <Text minW={{ md: "200px" }} fontSize="20px" fontWeight="bold" color="#000000">
                        답변 받으실 이메일
                    </Text>
                    <HStack w="full" gap={2}>
                        <Input w="full" borderColor="lightgray" color="#000000" placeholder="이메일을 입력해주세요." />
                        <NativeSelect.Root w={{ base: "100%", md: "200px" }} h="36px" padding="5px 0px" border="1px solid lightgray" borderRadius="4px" variant="plain">
                            <NativeSelect.Field fontSize="14px" color="#898989" fontWeight="light" defaultValue="" h="24px">
                                <option value="" style={{ backgroundColor: "#F3F3F3" }}>직접입력</option>
                                <option value="gmail.com" style={{ backgroundColor: "#F3F3F3" }}>gmail.com</option>
                                <option value="naver.com" style={{ backgroundColor: "#F3F3F3" }}>naver.com</option>
                                <option value="hanmail.net" style={{ backgroundColor: "#F3F3F3" }}>hanmail.net</option>
                            </NativeSelect.Field>
                            <NativeSelectIndicator />
                        </NativeSelect.Root>
                    </HStack>
                </Flex>
            </VStack>
        </Container>
    );
}

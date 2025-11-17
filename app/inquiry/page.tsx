"use client";

import { useState } from "react";
import { toaster } from "@/components/ui/toaster"
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
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [email, setEmail] = useState("");
    const [domain, setDomain] = useState("");

    /* REQUEST */
    const handleSend = async () => {

        const fullEmail = `${email}@${domain}`;
        const formData = new FormData();
        formData.append("category", category);
        formData.append("content", content);
        formData.append("email", fullEmail);

        if (photo) {
            formData.append("file", photo);
        }

        console.log("📌 FormData 내용:");
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }


        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                body: formData
            });

            const result = await res.json();
            console.log("서버 응답:", result);

            if (result.message === "이메일 요청 성공") {
                toaster.create({
                    type: "success",
                    title: "문의가 성공적으로 전송되었습니다!",
                });
            }
        } catch (e) {
            console.error("에러:", e);
            toaster.create({
                type: "error",
                title: "문의 전송 실패!",
            });
        }
    }


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
                        <NativeSelect.Field fontSize="14px" color="#898989" fontWeight="light" h="24px" value={category} onChange={(e) => setCategory(e.target.value)}>
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
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <Text fontSize="14px" fontWeight="light" color="#898989">
                            이미지파일 (JPG, PNG, GIF) 1장을 첨부할 수 있어요.
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
                        <Input w="full" h="36px" borderColor="lightgray" color="#000000" placeholder="이메일을 입력해주세요." value={email} onChange={(e) => setEmail(e.target.value)} />
                        <NativeSelect.Root w={{ base: "100%", md: "200px" }} h="36px" padding="5px 0px" border="1px solid lightgray" borderRadius="4px" variant="plain">
                            <NativeSelect.Field fontSize="14px" color="#898989" fontWeight="light" h="24px" value={domain} onChange={(e) => setDomain(e.target.value)}>
                                <option value="" style={{ backgroundColor: "#F3F3F3" }}>직접입력</option>
                                <option value="gmail.com" style={{ backgroundColor: "#F3F3F3" }}>gmail.com</option>
                                <option value="naver.com" style={{ backgroundColor: "#F3F3F3" }}>naver.com</option>
                                <option value="hanmail.net" style={{ backgroundColor: "#F3F3F3" }}>hanmail.net</option>
                            </NativeSelect.Field>
                            <NativeSelectIndicator />
                        </NativeSelect.Root>
                    </HStack>
                </Flex>
                <Flex w="100%" justify="flex-end" mt={4} >
                    <Button w={{ base: "100%", sm: "300px" }} h="40px" bg="#FA6D6D" borderRadius="4px" fontSize="16px" color="#FFFFFF" _hover={{ bg: "#ff8e8eff" }} onClick={handleSend}>등록</Button>
                </Flex>
            </VStack>
        </Container>
    );
}

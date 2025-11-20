"use client";

import { Text, Portal, CloseButton, Dialog, Button, Image, Flex, VStack, HStack, Box, Textarea, Span, } from "@chakra-ui/react";
import { useState, useRef } from "react";

interface inquiryDialogProps {
    id: string;
    content: string;
    type: string;
    imageUrl: string;
    answer: string;
    onUpdate?: () => void;
    onSuccess?: () => void;
    onFail?: () => void;
    onDelSuccess?: () => void;
    onDelFail?: () => void;
}

export default function inquiryDialog({ id, content, type, imageUrl, answer, onUpdate, onSuccess, onFail, onDelSuccess, onDelFail }: inquiryDialogProps) {

    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const [contentContent, setcontentContent] = useState(answer ?? "");

    /* 저장 */
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("content", contentContent);
 
        console.log("=== FormData 내용 ===");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        /* REQUEST */
        try {
            const res = await fetch(`/api/inquiry/notice`, {
                method: "POST",
                body: formData
            });

            const result = await res.json();
            console.log("서버 응답:", result);

            if (result.message === "답변 저장 성공") {
                closeBtnRef.current?.click();
                onSuccess?.();
                onUpdate?.();
            }
        } catch (e) { console.error("에러:", e); onFail?.(); }
    }

    /* 삭제 */
    const handleDel = async () => {
        try {
            const res = await fetch(`/api/inquiry/notice?id=${id}`, {
                method: "DELETE",
            });

            const result = await res.json();
            console.log("서버 응답:", result);

            if (result.message === "답변 삭제 성공") {
                closeBtnRef.current?.click();
                onDelSuccess?.();
                onUpdate?.();
            }
        } catch (e) { console.error("에러:", e); onDelFail?.(); }
    }

    return (
        <Dialog.Root
            onOpenChange={(open) => {
                if (open) {
                    setcontentContent(answer ?? "");
                }
            }}>

            <Dialog.Trigger asChild>
                <Button bg="#fc6a6aff" marginLeft="10px" fontSize="13px" color="white" h="27px" px="10px">답변하기</Button>
            </Dialog.Trigger>

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
                                답변 하기
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

                            <Span
                                mt="8px" 
                                display="block"
                                color="#000000ff"
                                flex="1"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis">
                                <HStack><Text color="#fc6a6aff">Q.</Text> [{type}] {content}</HStack>
                            </Span>

                            <Box bg="#fff3f3" p={3} borderRadius="5px" mb={3}>
                                {imageUrl && (
                                    <Image w="150px" h="170px" objectFit="cover" src={imageUrl} paddingBottom="10px"></Image>
                                )}
                                <Text color="#3f3f3f">{content}</Text>
                            </Box>
                            <Textarea autoresize color="#1d1d1dff" h="200px" minH="200px" value={contentContent} onChange={(e) => setcontentContent(e.target.value)}/>
                            
                        </Dialog.Body>

                        {/* 푸터 */}
                        <Dialog.Footer p="0" paddingTop="10px">
                            <Flex w="100%" gap="8px">
                                <Button flex="1" bg="#FFFFFF" border="1px solid #cececeff" borderRadius="4px" fontSize="16px" color="#000000" _hover={{ bg: "#f5f5f5", borderColor: "#bfbfbf" }} onClick={handleDel}>삭제</Button>
                                <Button flex="1" bg="#FA6D6D" borderRadius="4px" fontSize="16px" color="#FFFFFF" _hover={{ bg: "#ff8e8eff" }} onClick={handleSave} >저장</Button>
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

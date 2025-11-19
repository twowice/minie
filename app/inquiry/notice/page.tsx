"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Text,
  HStack,
  VStack,
  Button,
  Input,
  Flex,
  Box,
  Accordion,
  Span,
  Spinner,
  Image
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InquiryDialog from "@/components/InquiryDialog";
import { toaster } from "@/components/ui/toaster"

export default function Page() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState<any[]>([]);

  const fetchInquiry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/inquiry/notice`);
      const result = await res.json();

      if (res.ok && result.data) {
        console.log("응답:", result.data)
        setInquiry(result.data);
      }
    }
    catch (e) { console.error("서버 연결 실패:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInquiry(); }, []);

  /* 로딩 */
  if (loading) {
    return (
      <>
        <VStack colorPalette="pink">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">불러오는 중...</Text>
        </VStack>
      </>
    );
  }

  /* 토스트 */
  const showSaveSuccessToast = () => {
    toaster.create({
      type: "success",
      title: "답변이 성공적으로 추가되었습니다!",
    });
  }

  const showSaveFailToast = () => {
    toaster.create({
      type: "error",
      title: "답변 추가 실패!",
    });
  }


  const showDelSuccessToast = () => {
    toaster.create({
      type: "success",
      title: "답변이 성공적으로 삭제되었습니다!",
    });
  }

  const showDelFailToast = () => {
    toaster.create({
      type: "error",
      title: "답변 삭제 실패!",
    });
  }

  return (
    <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
      <Text fontSize={{ base: "24px", md: "32px" }} fontWeight="semibold" color="#000000" mb={4}>
        1:1 문의
      </Text>


      <VStack align="flex-start" w="100%" bg="#f8f8f8ff" p="20px">
        <Flex w="100%" direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={{ base: 4, md: 0 }}>
          <VStack w="100%" align="flex-start">
            {/* 문의 기간 */}
            <HStack w="100%" flexWrap="wrap" gap={2}>
              <Text color="#000000" minW="80px" fontSize="13px">문의기간</Text>
              <Button borderRadius="5px" border="1px solid lightgray" h="30px">1개월</Button>
              <Button borderRadius="5px" border="1px solid lightgray" h="30px">3개월</Button>
              <Button borderRadius="5px" border="1px solid lightgray" h="30px">5개월</Button>
              <Button borderRadius="5px" border="1px solid lightgray" h="30px">12개월</Button>
            </HStack>

            {/* 기간 선택 */}
            <HStack w="100%" gap={2}>
              <Text minW="80px" color="#000000" fontSize="13px">기간 선택</Text>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={<Input w="135px" h="30px" borderColor="lightgray" color="#3f3f3fff" />}
                placeholderText="시작 날짜"
              />
              <Text color="#000000">~</Text>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={<Input w="135px" h="30px" borderColor="lightgray" color="#3f3f3fff" />}
                placeholderText="종료 날짜"
              />
            </HStack>
          </VStack>
          <Button
            bg="#FA6D6D"
            color="#fff"
            borderRadius="5px" w={{ base: "100%", md: "auto" }}
            h={{ base: "40px", md: "40px" }}
            mt={{ base: 4, md: 0 }}
            _hover={{ bg: "#ff8e8e" }} >
            조회
          </Button>
        </Flex>
      </VStack>

      <Accordion.Root collapsible p="20px">
        {inquiry.map((item, index) => (
          <Accordion.Item color="#000000" borderColor="#00000020" key={index} value={`${item.created_at}-${item.content}`} >
            <Accordion.ItemTrigger h="50px" cursor="pointer">
              <Span
                color="#000000ff"
                flex="1"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis">
                <HStack><Text color="#fc6a6aff">Q.</Text> [{item.inquiry_type}] {item.content}</HStack>
              </Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Box bg="#fff3f3" p={3} borderRadius="5px" mb={3}>
                  {item.image_url && (
                    <Image w="150px" h="170px" objectFit="cover" src={item.image_url} paddingBottom="10px"></Image>
                  )}
                  <Text color="#3f3f3f">{item.content}</Text>
                </Box>
                <Box p={3} borderRadius="5px">
                  <HStack marginBottom="10px">
                    <Text fontWeight="bold" color="#fc6a6aff">답변</Text>

                    <InquiryDialog
                      id={item.id}
                      content={item.content}
                      type={item.inquiry_type}
                      imageUrl={item.image_url}
                      answer={item.answer}
                      onUpdate={fetchInquiry}
                      onSuccess={showSaveSuccessToast}
                      onFail={showSaveFailToast}
                      onDelSuccess={showDelSuccessToast}
                      onDelFail={showDelFailToast}
                    />
                  </HStack>
                  <Text color="#3f3f3f">{item.answer || "아직 답변이 등록되지 않았습니다."}</Text>
                </Box>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Container>

  )
}

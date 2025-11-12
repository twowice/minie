"use client";

import { Box, VStack, Container, Heading } from "@chakra-ui/react" // 제목에서 쓰인 라이브러리
import { Text, Input, Button, Flex } from "@chakra-ui/react" // 입력폼에서 쓰인 라이브러리
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react" // 생년월일 드롭다운 박스에서 쓰인 라이브러리
import FormField from "@/components/FormField"; // text와 input 컴포넌트

export default function SignupPage() {
  return (
    // 전체 body 박스
    <Box
      px="40px"
      py="24px"
      flex="1"
      display="flex"
      alignItems="center" // 세로 중앙 정렬
      justifyContent="center" // 가로 중앙 정렬
    >

      {/* 회원가입 컨테이너 */}
      <Container maxW="md">

        {/* 요소들 세로 정렬 */}
        <VStack gap={4}>

          {/* 첫 번째 책꽃이(제목) */}
          <Box display="flex" alignItems="center" justifyContent="center">
            <Heading as="h1" color="#000000" fontSize="28px" display="flex" alignItems="center">
              <Text as="span" fontFamily="Croissant One">
                Minié
              </Text>
              &nbsp;회원가입
            </Heading>
          </Box>

          {/* 두 번째 책꽃이(아이디) */}
          <Box w="full">
            <Text
              color="#000000"
              fontSize="16px"
              fontWeight="bold"
              height="32px"
              px="4px"
              display="flex"
              alignItems="center"
              justifyContent="start"
            >
              아이디
            </Text>
            <Box position="relative" w="full">
              <Input
                w="full"
                placeholder="이메일 형식의 아이디를 입력해주세요."
                border="1px solid"
                borderRadius="4px"
                borderColor="rgba(0, 0, 0, 0.3)"
                height="48px"
                color="#000000"
                px="12px"
                pr="90px" // 오른쪽에 버튼 공간 확보
                _focus={{
                  outline: "none",
                  borderColor: "#FA6D6D",
                  borderWidth: "2px"
                }}
              />
              <Button
                position="absolute"
                right="8px"
                top="50%"
                transform="translateY(-50%)"
                bg="rgba(0, 0, 0, 0.5)"
                color="#ffffff"
                borderRadius="4px"
                fontSize="14px"
                height="36px"
                px="12px"
                whiteSpace="nowrap"
              >
                중복확인
              </Button>
            </Box>
          </Box>


          {/* 세 번째 책꽃이(비밀번호) */}
          <FormField
            label="비밀번호"
            placeholder="비밀번호 8~12자, 영문+숫자+특수문자"
            type="password"
          />


          {/* 네 번째 책꽃이(비밀번호 확인) */}
          <FormField
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            type="password"
          />


          {/* 다섯 번째 책꽃이(이름) */}
          <FormField
            label="이름"
            placeholder="이름을 입력해주세요."
          />


          {/* 여섯 번째 책꽃이(전화번호) */}
          <FormField
            label="전화번호"
            placeholder="휴대폰 번호 (‘-’ 제외 11자리 입력)"
          />

          {/* 일곱 번째 책꽃이(생년월일) */}
          <Box w="full">
            <Text
              color="#000000"
              fontSize="16px"
              fontWeight="bold"
              height="32px"
              px="4px"
              display="flex"
              alignItems="center"
              justifyContent="start"
            >
              생년월일
            </Text>

            <Box display="flex" gap={2}>
              {/* 년도 */}
              <NativeSelectRoot flex={2}>
                <NativeSelectField
                  placeholder="년도"
                  border="1px solid"
                  borderRadius="4px"
                  borderColor="rgba(0, 0, 0, 0.3)"
                  color="rgba(0, 0, 0, 0.3)"
                  height="48px"
                  css={{
                    "& option": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  _focus={{
                    outline: "none",
                    borderColor: "#FA6D6D",
                    borderWidth: "2px"
                  }}
                >
                  <option value="">년도</option>
                  {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year: number) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </NativeSelectField>
                {/* 드롭다운 아이콘 */}
                <Box
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  color="rgba(0, 0, 0, 0.3)"
                  fontSize="12px"
                >
                  ▼
                </Box>
              </NativeSelectRoot>

              {/* 월 */}
              <NativeSelectRoot flex={1}>
                <NativeSelectField
                  placeholder="월"
                  border="1px solid"
                  borderRadius="4px"
                  borderColor="rgba(0, 0, 0, 0.3)"
                  color="rgba(0, 0, 0, 0.3)"
                  height="48px"
                  css={{
                    "& option": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  _focus={{
                    outline: "none",
                    borderColor: "#FA6D6D",
                    borderWidth: "2px"
                  }}
                >
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month: number) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </NativeSelectField>
                {/* 드롭다운 아이콘 */}
                <Box
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  color="rgba(0, 0, 0, 0.3)"
                  fontSize="12px"
                >
                  ▼
                </Box>
              </NativeSelectRoot>

              {/* 일 */}
              <NativeSelectRoot flex={1}>
                <NativeSelectField
                  placeholder="일"
                  border="1px solid"
                  borderRadius="4px"
                  borderColor="rgba(0, 0, 0, 0.3)"
                  color="rgba(0, 0, 0, 0.3)"
                  height="48px"
                  css={{
                    "& option": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                  _focus={{
                    outline: "none",
                    borderColor: "#FA6D6D",
                    borderWidth: "2px"
                  }}
                >
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day: number) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </NativeSelectField>
                {/* 드롭다운 아이콘 */}
                <Box
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  color="rgba(0, 0, 0, 0.3)"
                  fontSize="12px"
                >
                  ▼
                </Box>
              </NativeSelectRoot>
            </Box>
          </Box>

          {/* 여덟 번째 책꽃이(취소, 가입하기 버튼) */}
          <Box w="full">
            <Flex w="full" gap={2}>
              <Button
                flex="1"
                bg="rgba(255, 255, 2555, 0.2)"
                border="1px solid"
                borderRadius="4px"
                borderColor="rgba(0, 0, 0, 0.2)"
                fontSize="16px"
                height="48px"
              >
                취소
              </Button>
              <Button
                flex="1"
                bg="#FA6D6D"
                borderRadius="4px"
                fontSize="16px"
                color="#ffffff"
                height="48px"
              >
                가입하기
              </Button>
            </Flex>
          </Box>


        </VStack>
      </Container>
    </Box>
  )
}
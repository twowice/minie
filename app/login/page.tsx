/*
  next.js에서는 기본값이 SSR임 (Server Side Rendering : 서버에서 미리 HTML을 만들어 보내어 민감 데이터가 노출되지 않고 빠름
  하지만 우리는 브라우저에서 버튼을 클릭하고, 폼을 입력해야하므로 브라우저에서 동작하는 CSR(Client Side Rendering)을 사용함
*/
"use client"; 

import { Container, VStack, Box, Heading, Link} from "@chakra-ui/react"; // 헤더에 사용된 라이브러리
import { Input, Text, Flex } from "@chakra-ui/react"; // 입력폼에 사용된 라이브러리

export default function LoginPage(){
  return(
    // body 전체 영역
    <Box px="40px" py="24px" bg="gray.100" flex="1"> 

      {/* 로그인 컨테이너 */}
      <Container maxW = "md">
        {/* 세로형 책장 */}
        <VStack gap ={8}>

          {/* 첫 번째 책꽃이(제목) */}
          <Box textAlign="center">
            <Heading as="h1" fontSize="28px" color="#000000">
              Minié 로그인
            </Heading>
          </Box>

          {/* 두 번째 책꽃이(ID,PW) */}
          <Box w="full">
            <VStack gap={0} align="stretch">

              <Input 
                placeholder="이메일 형식의 아이디를 입력해주세요."
                borderTopRadius={4}
                borderBottomRadius={0} // 아래 모서리 각지게
                color="#000000" // 텍스트 색상
                borderColor="rgba(0, 0, 0, 0.3)" // 바깥 선 검정색에 투명도 30%
                height="56px"
                fontSize="16px"
                _focus={{ // 차크라 ui의 클릭시 스타일 변경 문법 _focus={{, , ,}}
                  borderColor: "#FA6D6D", // 클릭시 외곽 색상 변경
                  outline: "none", // 기본 회색 그림자 없애기
                  borderWidth: "2px" // 테두리 굵기
                }} 
                />
              <Input 
                type="password"
                placeholder="비밀번호 (8~12자, 영문+숫자+특수문자)"
                borderBottomRadius={4}
                borderTopRadius={0}
                borderTop="none"
                color="#000000"
                borderColor="rgba(0, 0, 0, 0.3)"
                height="56px"
                fontSize="16px"
                _focus={{
                  borderColor: "#FA6D6D",
                  outline: "none",
                  borderWidth: "2px",
                  borderTop: "2px solid #FA6D6D",
                }}
                />
            </VStack>
          </Box>

         {/* 세 번째 책꽃이(회원가입) */}
          <Box w="full">
            <Flex justify="flex-end">
              <Link 
                href="/signup"
                _hover={{ textDecoration: "none" }}  // 밑줄 제거
                _focus={{ boxShadow: "none" }}       // 포커스 테두리 제거
              >
                <Text 
                  fontSize="sm" 
                  color="gray.600"
                  cursor="pointer"
                  _hover={{ color: "black" }}
                  >회원가입
                </Text>
              </Link>
            </Flex>
          </Box>


        </VStack>
      </Container>

    </Box>
  )
}
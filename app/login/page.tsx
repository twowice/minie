/*
  next.js에서는 기본값이 SSR임 (Server Side Rendering : 서버에서 미리 HTML을 만들어 보내어 민감 데이터가 노출되지 않고 빠름
  하지만 우리는 브라우저에서 버튼을 클릭하고, 폼을 입력해야하므로 브라우저에서 동작하는 CSR(Client Side Rendering)을 사용함
*/
"use client"; 

import { Container, VStack, Box, Heading, Link} from "@chakra-ui/react"; // 헤더에 사용된 라이브러리
import { Input, Text, Flex } from "@chakra-ui/react"; // 입력폼에 사용된 라이브러리
import { Button } from "@chakra-ui/react"; // 일반 및 소셜 로그인 버튼에 사용된 라이브러리
import { FcGoogle } from "react-icons/fc";  // 구글 아이콘
import { RiKakaoTalkFill } from "react-icons/ri";  // 카카오 아이콘
import { SiNaver } from "react-icons/si";  // 네이버 아이콘

export default function LoginPage(){
  return(
    // body 전체 영역
    <Box 
      px="40px" 
      py="24px" 
      flex="1"
      display="flex"
      alignItems="center" // 세로 중앙 정렬
      justifyContent="center" // 가로 중앙 정렬
      
    > 

      {/* 로그인 컨테이너 */}
      <Container maxW = "md">
        {/* 세로형 책장 */}
        <VStack gap ={4}>

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

         {/* 세 번째 책꽃이(회원가입 버튼) */}
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

          {/* 네 번째 책꽃이(로그인 버튼) */}
          <Box w="full">
            <Button 
              w="full"
              bg="#FA6D6D"
              height="48px"
              borderRadius="4px"
              color="#ffffff"
              fontSize="16px"
              fontWeight="medium"
              >
              로그인
            </Button>
          </Box>

          {/* 다섯 번째 책꽃이(구분선) */}
          <Flex align="center" w="full"> {/* VStack이 세로형 책꽃이였다면, Flex는 가로 방향으로 정렬하는 책꽃이, 세로는 중앙에 배치*/}
            <Box flex="1" h="1px" bg="rgba(0, 0, 0, 0.4)" /> {/* flex="1"을 해주면 남는 공간을 모두 차지한다는 뜻 */}
            <Text px={4} fontSize="12px" color="rgba(0, 0, 0, 0.4)"> {/* px={4} => px="16px"과 같은 뜻, x축 좌우 여백을 16px만큼 줌.*/}
              또는
            </Text>
            <Box flex="1" h="1px" bg="rgba(0, 0, 0, 0.4)" />
          </Flex>

          {/* 여섯 번째 책꽃이(구글 로그인) */}
          <Box w="full">
            <Button w="full"
              bg="#ffffff"
              border="1px solid"
              borderRadius="4px"
              borderColor="rgba(0, 0, 0, 0.3)"
              fontSize="16px"
              color="rgba(0, 0, 0, 0.8)"
              height="48px"
              fontWeight="bold"
            >
              <Box position="absolute" left="16px">  {/* 아이콘 왼쪽 고정 */}
                <FcGoogle style={{ width: '24px', height: '24px' }} />
              </Box>
                Google 로그인
            </Button>
          </Box>

          {/* 일곱 번째 책꽃이(카카오 로그인) */}
          <Box w="full">
            <Button w="full"
              bg="#FEE500"
              borderRadius="4px"
              fontSize="16px"
              color="rgba(0, 0, 0, 0.8)"
              height="48px"
              fontWeight="bold"
            >
              <Box position="absolute" left="16px">
                <RiKakaoTalkFill style={{width: "24px", height: "24px"}}/>
              </Box>
              Kakao 로그인
            </Button>
          </Box>

          {/* 여덟 번째 책꽃이(네이버 로그인) */}
          <Box w="full">
            <Button w="full"
              bg="#03C75A"
              borderRadius="4px"
              fontSize="16px"
              color="#ffffff"
              height="48px"
              fontWeight="bold"
            >
              <Box position="absolute" left="20px">
                <SiNaver style={{width: "16px", height: "16px"}}/>
              </Box>
              Naver 로그인
            </Button>
          </Box>

        </VStack>
      </Container>

    </Box>
  )
}
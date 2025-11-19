"use client";

import { Box, VStack, Container, Heading } from "@chakra-ui/react" // 제목에서 쓰인 라이브러리
import { Text, Input, Button, Flex } from "@chakra-ui/react" // 입력폼에서 쓰인 라이브러리
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react" // 생년월일 드롭다운 박스에서 쓰인 라이브러리
import FormField from "@/components/FormField"; // text와 input 컴포넌트

import { useState } from "react" // 각 Input에 들어갈 내용들의 상태 관리를 도와줄 React Hook
import { useRouter } from "next/navigation"

import { auth } from "@/firebase/firebaseConfig" // 인증 문지기
import { createUserWithEmailAndPassword } from "firebase/auth" // 회원가입 시켜주는 firebase 함수

import { createUser, getUserByEmail } from "@/lib/minie/authAPI"

// 프로필 이미지를 위한 import
import { uploadProfileImage } from "@/lib/minie/authAPI"  
import { Image } from "@chakra-ui/react"  

import { useUser } from "@/context/UserContext"; // 2025-11-19 추가

// =====================================================================================================================================================================================
export default function SignupPage() {
  
  const [email, setEmail] = useState(""); // 이메일 형식의 아이디
  const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 검사
  const [password, setPassword] = useState(""); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [name, setName] = useState(""); // 이름
  const [phone, setPhone] = useState(""); // 전화번호
  const [birthdate, setBirthdate] = useState({year: "", month: "", day: ""}) // {} 키와 값으로 이루어진 객체 -> 생년월일
  const [error, setError] = useState({
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    }
  );
  const router = useRouter();
  const { setUser } = useUser(); // 2025-11-19 추가

  const [profileImage, setProfileImage] = useState<File | null>(null);  // 프로필 이미지
  const [previewUrl, setPreviewUrl] = useState<string>("");  // 프로필 이미지
// =====================================================================================================================================================================================


  // 이메일 정규 표현식 검사 함수
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // 영어 대소문자와 숫자0~9._-가 허용되고 + @가 들어가야하고 같은 규칙 + .이 들어가야하고 2~4자리여야함
    return emailRegex.test(email); //useState로 정의된 email을 검사하고 true or flase를 반환함
  };

  // 이메일 중복 검사 함수
  const checkEmailDuplicate = async () => {
    // 1. 이메일 형식 먼저 검사
    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "유효한 이메일 형식이 아닙니다." }));
      setIsEmailChecked(false);
      return;
    }

    try {
      // 2. 임시 비밀번호로 계정 생성 시도
      const tempPassword = "Temp1234!@#$";
      await createUserWithEmailAndPassword(auth, email, tempPassword);
      
      // 3. 생성 성공 = 중복 아님 → 바로 삭제
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      
      setError((prev) => ({ ...prev, email: "사용 가능한 이메일입니다." }));
      setIsEmailChecked(true);
      
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
        setIsEmailChecked(false);
      } else {
        setError((prev) => ({ ...prev, email: "중복 확인 중 오류가 발생했습니다." }));
        setIsEmailChecked(false);
      }
    }
  };

  // 비밀번호 규격 함수
  const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$$   %^&*])[A-Za-z\d!@#   $$%^&*]{8,12}$/;
  return passwordRegex.test(password);
};

  // 전화번호 규격 함수
  const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{11}$/; // 11자리 숫자만 허용
  return phoneRegex.test(phone);
};

// =====================================================================================================================================================================================
// 이미지 선택 핸들러 추가
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일인지 체크
    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setProfileImage(file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};







// 회원가입 비동기 함수
const handleSignUP = async () => {
  
  // 이메일이 중복 확인을 눌렀는지
  if (!isEmailChecked) {
    setError((prev) => ({ ...prev, email: "이메일 중복확인을 먼저 해주세요." }));
    return;
  } 

  // 이메일 정규 표현식이 false라면
  if(!validateEmail(email)){
    setError( (prev) => ({...prev, email: "유효한 이메일 형식이 아닙니다."}));
    return;
  }

  // 비밀번호 규격을 맞추지 못했다면 
  if(!validatePassword(password)){
    setError( (prev) => ({...prev, password: "영문+숫자+특수문자가 포함된 8~12자리로 입력해주세요."}))
    return;
  }

  // 비밀번호와 비밀번호 확인이 일치하지 않으면
  if(password !== confirmPassword){
    setError( (prev) => ({...prev, confirmPassword: "비밀번호가 일치하지 않습니다."}));
    return;
  }

  // 전화번호가 '-'을 제외한 11자리 숫자가 아닐 경우
  if(!validatePhone(phone)){
    setError( (prev) => ({...prev, phone: "전화번호는 '-'을 제외한 11자리의 숫자를 입력해주세요."}));
    return;
  }

  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 프로필 이미지 업로드 (있으면)
    let profileImageUrl = null;
    if (profileImage) {
      profileImageUrl = await uploadProfileImage(profileImage, firebaseUser.uid);
    }

    // Supabase에 저장하고 userData 받기 (2025-11-19)
    const userData = await createUser({
      firebase_uid: firebaseUser.uid,
      email: email,
      name: name,
      phone: phone,
      birth_date: birthdate,
      profile_image: profileImageUrl
    });
/*
    await createUser({
      firebase_uid: firebaseUser.uid,
      email: email,
      name: name,
      phone: phone,
      birth_date: birthdate,
      profile_image: profileImageUrl
    });
*/
    // 2025-11-19 
    setUser(userData);

    alert("회원가입이 완료되었습니다!");
    router.push("/");

  } catch(err: any) {
    console.error("회원가입 오류:", err);
    alert("회원가입 중 오류가 발생했습니다.");
  }
};


// =====================================================================================================================================================================================
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

          {/* 프로필 이미지 업로드*/}
          <Box w="full">
            {/* 프로필 이미지 원형 */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={3}>
              {/* 이미지 원 */}
              <Box position="relative">
                <Box
                  width="120px"
                  height="120px"
                  borderRadius="50%"
                  overflow="hidden"
                  border="2px solid #E5E5E5"
                  bg="#F5F5F5"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="프로필 이미지"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  ) : (
                    // 기본 사용자 아이콘
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="#CCCCCC"/>
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#CCCCCC"/>
                    </svg>
                  )}
                </Box>
                
                {/* 카메라 버튼 (오른쪽 하단) */}
                <label htmlFor="profile-image-input">
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    width="36px"
                    height="36px"
                    borderRadius="50%"
                    bg="#FA6D6D"
                    border="2px solid white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ bg: "#E85C5C" }}
                    transition="all 0.2s"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 15.5c1.933 0 3.5-1.567 3.5-3.5s-1.567-3.5-3.5-3.5-3.5 1.567-3.5 3.5 1.567 3.5 3.5 3.5z"/>
                      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
                    </svg>
                  </Box>
                </label>
              </Box>

              {/* 파일명 또는 안내 문구 */}
              <Text fontSize="14px" color="gray.600" textAlign="center">
                {profileImage ? profileImage.name : "프로필 이미지 (선택)"}
              </Text>

              {/* hidden input */}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                display="none"
                id="profile-image-input"
              />
            </Box>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailChecked(false); // 중복확인 초기화
                  setError((prev) => ({ ...prev, email: "" })); // 에러 초기화
                }}
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
                onClick={checkEmailDuplicate}
              >
                중복확인
              </Button>
            </Box>
            {error.email && <Text fontSize="sm" color="red.500">{error.email}</Text>}
          </Box>


          {/* 세 번째 책꽃이(비밀번호) */}
          <FormField
            label="비밀번호"
            placeholder="비밀번호 8~12자, 영문+숫자+특수문자"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: "" })); //에러 초기화
            }}
            error={error.password}
          />


          {/* 네 번째 책꽃이(비밀번호 확인) */}
          <FormField
            label="비밀번호 확인"
            placeholder="비밀번호 재입력"
            type="password"
            value = {confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError((prev) => ({ ...prev, confirmPassword: "" })); //에러 초기화
            }}
            error={error.confirmPassword}
          />



          {/* 다섯 번째 책꽃이(이름) */}
          <FormField
            label="이름"
            placeholder="이름을 입력해주세요."
            value = {name}
            onChange={ (e) => setName(e.target.value) }
          />


          {/* 여섯 번째 책꽃이(전화번호) */}
          <FormField
            label="전화번호"
            placeholder="휴대폰 번호 (‘-’ 제외 11자리 입력)"
            value = {phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError((prev) => ({ ...prev, phone: "" })); //에러 초기화
            }}
            error={error.phone}
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
                  color={birthdate.year ? "#000000" : "rgba(0, 0, 0, 0.3)"}
                  height="48px"
                  value={birthdate.year}
                  onChange={(e) => setBirthdate({...birthdate, year: e.target.value})}
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
                  <option value="" disabled hidden>년도</option>
                  {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year: number) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </NativeSelectField>
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
                  color={birthdate.month ? "#000000" : "rgba(0, 0, 0, 0.3)"}
                  height="48px"
                  value={birthdate.month}
                  onChange={(e) => setBirthdate({...birthdate, month: e.target.value})}
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
                  <option value="" disabled hidden>월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month: number) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </NativeSelectField>
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
                  color={birthdate.day ? "#000000" : "rgba(0, 0, 0, 0.3)"}
                  height="48px"
                  value={birthdate.day}
                  onChange={(e) => setBirthdate({...birthdate, day: e.target.value})}
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
                  <option value="" disabled hidden>일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day: number) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </NativeSelectField>
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
                bg="rgba(255, 255, 255, 0.2)"
                border="1px solid"
                borderRadius="4px"
                borderColor="rgba(0, 0, 0, 0.2)"
                fontSize="16px"
                height="48px"
                onClick={() => router.push("/login")} // 취소 클릭 시 로그인 화면으로 이동
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
                onClick={handleSignUP}
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
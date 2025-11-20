"use client";

import { Box, VStack, Text, Input, Button, Flex } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { uploadProfileImage } from "@/lib/minie/authAPI";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  
  // 상태 관리
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState({ year: "", month: "", day: "" });
  const [error, setError] = useState({ phone: "" });
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 설정
  useEffect(() => {
    if (!user) return;

    setPreviewUrl(user.profile_image || "");
    setPhone(user.phone || "");

    // birth_date 처리 – 이제 타입이 정확함!
    if (user.birth_date) {
      if (typeof user.birth_date === "string") {
        // "1995-03-15" 형식
        const [year, month, day] = user.birth_date.split("-");
        setBirthdate({ year, month, day });
      } else if (user.birth_date && typeof user.birth_date === "object") {
        // 이미 { year, month, day } 객체인 경우
        setBirthdate({
          year: String(user.birth_date.year || ""),
          month: String(user.birth_date.month || ""),
          day: String(user.birth_date.day || ""),
        });
      }
    }
  }, [user]);

  // 이미지 선택 핸들러
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

  // 전화번호 유효성 검사
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 전화번호 유효성 검사
    if (!validatePhone(phone)) {
      setError({ phone: "전화번호는 '-'을 제외한 11자리의 숫자를 입력해주세요." });
      return;
    }

    setIsLoading(true);

    try {
      let newProfileImageUrl = user?.profile_image;

      // 프로필 이미지가 변경되었으면 업로드
      if (profileImage && user?.firebase_uid) {
        newProfileImageUrl = await uploadProfileImage(profileImage, user.firebase_uid);
      }

      // Supabase 업데이트
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          phone: phone,
          birth_date: `${birthdate.year}-${birthdate.month.padStart(2, '0')}-${birthdate.day.padStart(2, '0')}`,
          profile_image: newProfileImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('firebase_uid', user?.firebase_uid)
        .select()
        .single();

      if (updateError) throw updateError;

      // Context 업데이트
      setUser(data);
      
      alert("프로필이 성공적으로 수정되었습니다!");
      
    } catch (err: any) {
      console.error("프로필 수정 오류:", err);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Text color="#000000" fontWeight="bold" fontSize="28px" mb="24px">
        내 프로필
      </Text>

      <VStack gap={6} align="stretch">
        {/* 프로필 이미지 */}
        <Box>
          <Text
            color="#000000"
            fontSize="16px"
            fontWeight="bold"
            height="32px"
            px="4px"
            display="flex"
            alignItems="center"
          >
            프로필 이미지
          </Text>
          
          <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={3}>
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
                  <img
                    src={previewUrl}
                    alt="프로필 이미지"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  // 기본 사용자 아이콘
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#CCCCCC"/>
                    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#CCCCCC"/>
                  </svg>
                )}
              </Box>
              
              {/* 카메라 버튼 */}
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

            <Text fontSize="14px" color="gray.600" textAlign="center">
              {profileImage ? profileImage.name : "프로필 이미지 변경"}
            </Text>

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
              id="profile-image-input"
            />
          </Box>
        </Box>

        {/* 이메일 (수정 불가) */}
        <Box>
          <Text
            color="#000000"
            fontSize="16px"
            fontWeight="bold"
            height="32px"
            px="4px"
            display="flex"
            alignItems="center"
          >
            이메일
          </Text>
          <Input
            value={user?.email || ""}
            disabled
            bg="gray.100"
            height="48px"
            border="1px solid"
            borderColor="rgba(0, 0, 0, 0.3)"
            borderRadius="4px"
          />
        </Box>

        {/* 이름 (수정 불가) */}
        <Box>
          <Text
            color="#000000"
            fontSize="16px"
            fontWeight="bold"
            height="32px"
            px="4px"
            display="flex"
            alignItems="center"
          >
            이름
          </Text>
          <Input
            value={user?.name || ""}
            disabled
            bg="gray.100"
            height="48px"
            border="1px solid"
            borderColor="rgba(0, 0, 0, 0.3)"
            borderRadius="4px"
          />
        </Box>

        {/* 전화번호 (수정 가능) */}
        <Box>
          <Text
            color="#000000"
            fontSize="16px"
            fontWeight="bold"
            height="32px"
            px="4px"
            display="flex"
            alignItems="center"
          >
            전화번호
          </Text>
          <Input
            placeholder="휴대폰 번호 ('-' 제외 11자리 입력)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError({ phone: "" });
            }}
            height="48px"
            border="1px solid"
            borderColor="rgba(0, 0, 0, 0.3)"
            borderRadius="4px"
            _focus={{
              outline: "none",
              borderColor: "#FA6D6D",
              borderWidth: "2px"
            }}
          />
          {error.phone && <Text fontSize="sm" color="red.500">{error.phone}</Text>}
        </Box>

        {/* 생년월일 (수정 가능) */}
        <Box>
          <Text
            color="#000000"
            fontSize="16px"
            fontWeight="bold"
            height="32px"
            px="4px"
            display="flex"
            alignItems="center"
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

        {/* 저장 버튼 */}
        <Box w="full" mt={4}>
          <Button
            w="full"
            bg="#FA6D6D"
            borderRadius="4px"
            fontSize="16px"
            color="#ffffff"
            height="48px"
            onClick={handleSave}
            loading={isLoading}
          >
            저장하기
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
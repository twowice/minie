"use client";

import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { auth } from "@/firebase/firebaseConfig";
import { supabase } from "@/lib/supabase";

export default function WithdrawPage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    // 확인 대화상자
    const confirmMessage = "정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.";
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Supabase에서 사용자 데이터 삭제
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('firebase_uid', user?.firebase_uid);

      if (deleteError) throw deleteError;

      // 2. Firebase 계정 삭제
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }

      // 3. Context 초기화
      setUser(null);

      alert("회원 탈퇴가 완료되었습니다.");
      router.push("/");

    } catch (err: any) {
      console.error("회원 탈퇴 오류:", err);
      
      // 재인증이 필요한 경우
      if (err.code === 'auth/requires-recent-login') {
        alert("보안을 위해 다시 로그인한 후 회원 탈퇴를 진행해주세요.");
        router.push("/login");
      } else {
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Text color="#000000" fontWeight="bold" fontSize="28px" mb="24px">
        회원탈퇴
      </Text>

      <VStack gap={6} align="stretch" maxW="600px">
        {/* 안내 문구 */}
        <Box>
          <Text color="#000000" fontSize="16px" mb="16px">
            회원 탈퇴(이용약관 동의 철회)시 아래 내용을 확인해주세요.
          </Text>

          <Box 
            bg="#F5F5F5" 
            p="20px" 
            borderRadius="8px"
            border="1px solid #E5E5E5"
          >
            <VStack align="stretch" gap={3}>
              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié 이용약관 동의 철회 시 회원님께 제공 및 고객님께서 보유하신 모든 포인트, 쿠폰 정보는 삭제가 됩니다.
              </Text>
              
              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié이용권은 즉시 환불 서비스는 Minié 자체능력 이용중 또 권한 내지, Minié 이용약관 환불 정책에 의하여만 환불 약관에 따라 환불하신 서비스를 이용할 수 없습니다.
              </Text>

              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié 이용약관에 이용하려면 기간과 고객님은 더 이용하신 서비스 기능의 환불정책 양은 우는 서비스 정일 외치 수 없습니다.
              </Text>

              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié 이용약관 동의 철회 시 고객님께서 보유하신 모든 수 있습니다, 제공등 서비는 복원될 불가합니다.
              </Text>
            </VStack>
          </Box>
        </Box>

        {/* 확인 문구 */}
        <Box textAlign="center" py="20px">
          <Text fontSize="16px" fontWeight="semibold" color="#000000">
            Minié 회원 탈퇴(이용약관 동의 철회)를 하시겠습니까?
          </Text>
        </Box>

        {/* 탈퇴 버튼 */}
        <Box w="full">
          <Button
            w="full"
            bg="#FA6D6D"
            borderRadius="4px"
            fontSize="16px"
            color="#ffffff"
            height="48px"
            onClick={handleWithdraw}
            loading={isLoading}
          >
            회원 탈퇴
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
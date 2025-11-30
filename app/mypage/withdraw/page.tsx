"use client";

import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { auth } from "@/firebase/firebaseConfig";
import { authSupabase } from "@/lib/authSupabase";

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
      const { error: deleteError } = await authSupabase
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
    <Box                // 화면 높이 꽉 채우기
      display="flex"                
      alignItems="center"           // 세로 중앙
      justifyContent="center"       // 가로 중앙
      p={4}       
    >
      <VStack align="stretch" maxW="600px">
        <Box>
          {/* 안내 문구 */}
          <Text color="#000000" fontWeight="bold" fontSize="28px" mb="24px" textAlign="center">
            회원탈퇴
          </Text>
          <Text color="#000000" fontSize="16px" mb="16px" textAlign="center">
            회원 탈퇴(이용약관 동의 철회)시 아래 내용을 확인해주세요.
          </Text>

          <Box 
            bg="#F5F5F5" 
            p="20px" 
            borderRadius="8px"
            border="1px solid #E5E5E5"
          >
            <VStack align="stretch">
              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié 이용약관 동의 철회 시 올리브영 회원 개인정보 및 고객님께서 보유하셨던 쿠폰은 모두 삭제되며, 쿠폰 정보는 재가입시 복원이 불가능합니다.
              </Text>
              
              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié이용약관 동의 철회 시에는 Minié 서비스를 이용할 수 없게 되며, Minié 이용약관 동의를 철회한 후에라도 해당 약관에 다시 동의하시면 서비스를 이용할 수 있습니다.
              </Text>

              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                진행 중인 전자상거래 이용내역이 있거나 고객상담 및 이용하신 서비스가 완료되지 않은 경우 서비스 철회 하실 수 없습니다.
              </Text>

              <Text fontSize="14px" color="#333333" lineHeight="1.6">
                Minié 이용약관 동의 철회 시 고객님께서 보유하셨던 리워드는 모두 소멸되며, 재동의 시에도 복원은 불가합니다.
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
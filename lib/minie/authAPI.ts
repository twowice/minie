// authSupabase.ts에서 연결한 URL과 PUBLIC KEY를 가져오기 위한 import
import { authSupabase } from "@/lib/authSupabase";

// supabase(DB)에 저장할 정보들
export const createUser = async (userDate: {
  firebase_uid: string;
  email: string;
  name: string;
  phone: string;
  birth_date: { year: string; month: string; day: string };
  gender?: string;
}) => {
  // data = 결과, error = 오류를 반환해주는 supabase 변수
  const { data, error } = await authSupabase
    // 단계적으로 실행되는 체이닝메서드 시작
    .from('users') // supabase의 users 테이블로 이동
    .insert([
      {
        firebase_uid: userDate.firebase_uid, // 내가 web에서 입력받은 firebase_uid 값을 supabase users table에 있는 firebase_uid에 추가할게
        email: userDate.email,
        name: userDate.name,
        phone: userDate.phone,
        birth_date: userDate.birth_date,
        gender: userDate.gender || null,
        profile_image: null
      }
    ])
    .select() // 방금 추가한거 다시 가져와
    .single(); // 배열말고 객체 1개로 { email: , name:, phone: }

  if(error){
    // console.error = 콘솔 에러를 빨간색으로 출력
    console.error("supabase 사용자 생성 오류:", error); 
    // error 메세지를 보내고 에러가 발생된 곳으로 보냄
    throw error;
  }

  return data;
}




// 이메일로 사용자 조회 (중복 확인용)
export const getUserByEmail = async (email: string) => {
  const { data, error } = await authSupabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
}





// Firebase UID로 사용자 조회
export const getUserByFirebaseUid = async (firebaseUid: string) => {
  const { data, error } = await authSupabase
    .from('users')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .single();

  return { data, error };
}
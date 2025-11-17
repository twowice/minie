// authSupabase.ts에서 연결한 URL과 PUBLIC KEY를 가져오기 위한 import
import { authSupabase } from "@/lib/authSupabase";

// google login을 위한 import
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

// 프로필 이미지 업데이트를 위한 improt
import { supabaseStorage } from "@/lib/authSupabase";



// supabase(DB)에 저장할 정보들
export const createUser = async (userData: {
  firebase_uid: string;
  email: string;
  name: string;
  phone: string;
  birth_date: { year: string; month: string; day: string };
  gender?: string;
  profile_image?: string | null; 
  
}) => {
  // data = 결과, error = 오류를 반환해주는 supabase 변수
  const { data, error } = await authSupabase
    // 단계적으로 실행되는 체이닝메서드 시작
    .from('users') // supabase의 users 테이블로 이동
    .insert([
      {
        firebase_uid: userData.firebase_uid, // 내가 web에서 입력받은 firebase_uid 값을 supabase users table에 있는 firebase_uid에 추가할게
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        birth_date: userData.birth_date,
        gender: userData.gender || null,
        profile_image: userData.profile_image || null
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

// --------------------------------------------------------------------------------------------------------------------------------------------------
// Google login 함수
export const signInWithGoogle = async () => {
  // new GoogleAuthProvider()란 구글 로그인 정보를 담은 객체를 새로 생성해줌.
  const provider = new GoogleAuthProvider();

  try{
    // 구글 popup으로 로그인
    const result = await signInWithPopup(auth, provider);
    // .user 안에는 uid, email, displayName, photoURL등 사용자의 정보가 담겨있다
    const firebaseUser = result.user;

    // supabase에 이미 있는 사용자인지 확인.
    const { data: existingUser } = await getUserByFirebaseUid(firebaseUser.uid);

    if(!existingUser){
      await createUser({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "구글 사용자",
        phone: "", // 구글은 전화번호 안 줌
        birth_date: { year: "", month: "", day: ""}, // 구글은 생년월일 안 줌
        profile_image: firebaseUser.photoURL
      });
      alert("환영합니다 " + (firebaseUser.displayName || "구글 사용자") + "님!");
    } 

    return firebaseUser;
  }catch(error){
    console.error("Google 로그인 오류", error);
    throw error;
  }
}



// --------------------------------------------------------------------------------------------------------------------------------------------------
// 프로필 이미지 업로드 함수
export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop();
    // 고유한 파일명 생성 (userId + 현재시간)
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabaseStorage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('이미지 업로드 오류:', error);
      throw error;
    }

    // 공개 URL 생성
    const { data: publicUrlData } = supabaseStorage
      .from('profile-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    throw error;
  }
};
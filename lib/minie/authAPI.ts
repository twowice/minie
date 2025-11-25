// authSupabase.ts에서 연결한 URL과 PUBLIC KEY를 가져오기 위한 import
import { authSupabase } from "@/lib/authSupabase";

// google login을 위한 import
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

// 프로필 이미지 업데이트를 위한 improt
import { supabaseStorage } from "@/lib/authSupabase";


/* 
  각각 인증 정보가 필요한 api에 request에 "Authorization": `Bearer ${token}`를 추가해주는 헬퍼 함수를 작성하시거나 각 api 수정을 하시면 됩니다.
  인증이 필요한 api 통신의 fetch를 아래의 fetchWithAuth로 변경하시면 됩니다.
  

  - 주의사항 : 해당 로직은 Firebase AccessToken이 현재 firebase 클라이언트와 firbase auth(서버)에서 관리되는 동일 firebase uid가 동일한지
            (AccessToken유효한지) 검사하고서 header에 X-User-ID로 값을 전달해줍니다.
            클라이언트 쪽은 코드 변경하실 필요 없고 api 폴더 안에서 변경만 하시면 됩니다.
            uid를 가져오실 경우 아래 코드와 같이 NextRequest 인자를 받아서 진행하시면 됩니다.

            export async function GET(request:NextRequest) {
                const uid = request.headers.get('X-User-ID'); //string 타입 -> supabase의 user_id의 타입은 int이기에 number으로 전환하셔야 합니다.
            }

  사용법 예시 api/cart/route.ts, api/like/route.ts, api/order/route.ts


  - 사용자 인증 검사를 제외 방법
      1) middleware.ts 파일을 엽니다.
      2) 사용자 인증 과정을 제외하는 api 루트를 보아둔 PUBLIC_API_CONFIG 객체 안에 <경로: [허용할 HTTP 메소드 배열]> 형식으로 추가합니다
      3) 서버를 껐다가 다시 실행 시킵니다.
      4) 적용을 확인합니다.
  */
export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getFirebaseIdToken();

  if (!token) {
    throw new Error("Authentication required: No Firebase ID Token found.");
  }

  const headers = {
    // "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const fullUrl = new URL(path, window.location.origin).toString();

  return fetch(fullUrl, { ...options, headers })
}

let authReadyPromise: Promise<void> | null = null;

// Firebase 인증 상태가 완전히 로드될 때까지 기다리는 함수
async function waitForFirebaseAuth(): Promise<void> {
  if (authReadyPromise) {
    return authReadyPromise
  }

  authReadyPromise = new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve();
    });
  });
  return authReadyPromise;
}


/**
 * 현재 로그인된 사용자의 Firebase ID Token (accessToken)을 가져옵니다.
 * 이 함수는 Firebase 인증 상태가 준비될 때까지 기다립니다.
 */
async function getFirebaseIdToken(): Promise<string | null> {
  await waitForFirebaseAuth()

  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    console.log("token:", )
    return token;
  }
  return null
}


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

export const getUserIdByFirebaseUid = async (firebaseUid: string) => {
  const { data, error } = await authSupabase
    .from('users')
    .select('id')
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
  } catch (error: any) {
      // 팝업 닫기는 에러 로그 안 남김
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        throw error;
      }
      
      // 실제 에러만 로그 출력
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
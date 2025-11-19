// lib/authSupabase.ts

// createClient = Supabase와 연결하는 클라이언트를 만드는 함수
import { createClient } from '@supabase/supabase-js'

export const authSupabase = createClient(
  // 내 프로젝트와 supabase를 연결해줌
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // 연결할 때 인증할 키 값
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// supabase에서 storgae에 읽기/쓰기 권한 추가한 후 policy 추가하고 프로필 이미지 저장하기 위한 export
export const supabaseStorage = authSupabase.storage;
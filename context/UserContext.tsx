"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { getUserByFirebaseUid } from "@/lib/minie/authAPI";

// 사용자 타입 정의
interface User {
  id: number;
  firebase_uid: string;
  email: string;
  name: string;
  phone: string;
  birth_date: {
    year: string;
    month: string;
    day: string;
  };
  profile_image: string | null;
}

// Context 타입 정의
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
}

// Context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider 컴포넌트
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. localStorage에서 복구 시도
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Firebase 인증 상태 감지
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase에 로그인되어 있으면 Supabase에서 정보 가져오기
        const { data } = await getUserByFirebaseUid(firebaseUser.uid);
        if (data) {
          setUser(data);
          // localStorage에 저장 (새로고침 대비)
          localStorage.setItem("user", JSON.stringify(data));
        }
      } else {
        // 로그아웃 상태
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
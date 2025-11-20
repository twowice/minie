"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { auth } from "@/firebase/firebaseConfig";
import { getUserByFirebaseUid } from "@/lib/minie/authAPI";
import { isEqual } from "lodash";

// 사용자 타입 정의
interface User {
  id: number; //supabase db에서 사용되는 user_id 자동화 되어 헤더에서 조회 가능
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
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback(
    (newUser: User | null) => {
      // ✅ 기존 user와 새 user가 내용상 같다면 상태 업데이트 안 함
      if (!isEqual(user, newUser)) {
        setUserState(newUser);
      }
    },
    [user]
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const { data: userData } = await getUserByFirebaseUid(firebaseUser.uid);
        if (userData) {
          if (!isEqual(user, userData)) {
            setUser(userData);
          }
        } else {
          // Firebase 로그인 했으나 Supabase에 없는 경우
          if (user !== null) {
            setUser(null);
          }
        }
      } else {
        // 로그아웃된 경우
        if (user !== null) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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

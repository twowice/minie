// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyFirebaseToken } from "@/lib/auth/verifyFirebaseToken"; // ✅ 여기서만 Node.js 호환 verify 함수 사용

// 이 라우트 핸들러는 Node.js 런타임에서만 실행되도록 명시
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json(); // 미들웨어에서 보낸 토큰을 받음

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const decodedToken = await verifyFirebaseToken(token); // ✅ Node.js 런타임에서 토큰 검증

    if (!decodedToken) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    return NextResponse.json({ uid: decodedToken.uid, isValid: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error in /api/auth/verifyToken:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
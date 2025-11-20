import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserIdByFirebaseUid } from './lib/minie/authAPI';


/**
 * 인증이 필요 없는 공개 API 경로 규칙
 * - 경로: [허용할 HTTP 메소드 배열]
 */
const PUBLIC_API_CONFIG: Record<string, string[]> = {
  "/api/product": ["GET", "POST", "PUT", "DELETE"],
  "/api/reviews": ["GET"],
  "/api/payment/tosspayment": ["POST", "GET", "PUT", "DELETE"],
  "/api/order/order_detail": ["GET", "POST"],
  //추후에 인증정보가 필요없는 게스트 계정에게도 공개되어야 하는 api가 있으시면 추가하시길 바랍니다.
  //ex) "/api/auth/signup": ["POST"]
}

/**
 * JSON 형식으로 에러 응답을 생성하는 헬퍼 함수
 */
function jsonErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { method } = request;
  console.log("[Middleware] pathName: ",pathname)

  //미들웨어가 자체 인증 API를 호출하지 않도록 예외 처리 -> node:process에러 회피를 위해서 api로 분리해주었습니다.
  if (pathname === '/api/auth/verify') {
    return NextResponse.next()
  }

  //PUBLIC_API_CONFIG를 이용한 공개 API 경로 처리 
  for (const path in PUBLIC_API_CONFIG) {
    if (pathname.startsWith(path)) {
      const allowedMethods = PUBLIC_API_CONFIG[path];
      if (allowedMethods.includes(method)) {
        return NextResponse.next()
      }
    }
  }

  //인증 헤더 추출 -> headers에 Bearer로 시작하는 부분을 찾아내기 때문에 인증 정보를 요구하는 api는 헤더에 반드시 해당 부분을 추가하셔야 합니다.
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonErrorResponse("Unauthorized: Bearer token required", 401);
  }

  const token = authHeader.split(" ")[1];

  // 3. 별도의 API 라우트로 토큰 검증 요청
  let decodedUid: string | null = null;
  try {
    const verifyApiUrl = new URL('/api/auth/verify', request.nextUrl.origin);
    const verifyResponse = await fetch(verifyApiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      // 검증 API에서 에러 응답이 오면, 미들웨어도 에러 반환
      const errorData = await verifyResponse.json();
      return jsonErrorResponse(errorData.message || "Token verification failed", verifyResponse.status);
    }

    const { uid } = await verifyResponse.json(); // 검증 성공 시 uid 추출
    decodedUid = uid;

  } catch (error) {
    console.error("Error communicating with /api/auth/verify:", error);
    return jsonErrorResponse("Internal Server Error: Token verification system error", 500);
  }

  if (!decodedUid) { // 검증 결과로 uid를 받지 못했다면
    return jsonErrorResponse("Invalid Token or Verification Failure at Firebase\nCheck if the user is not registered in Firebase.", 401);
  }

  const {data:dbUid, error:dbError} = await getUserIdByFirebaseUid(decodedUid)
  if (dbError || !dbUid) {
        console.error("Supabase user profile not found or DB error for firebase_uid:", decodedUid, dbError);
        // Supabase에 해당 유저가 없으면 인증 실패로 간주하거나, 사용자 등록을 유도하는 응답
        return jsonErrorResponse("User profile not found in Supabase or DB error", 401);
      }
  
  // 5. 요청 헤더에 X-User-UID 추가 -> api 폴더 안의 서버 부분 api에서 해당 값을 통해 user를 특정하시면 됩니다
  //request에 X-User-ID로 존재할 겁니다. 단, 추출 시 string임을 잊지 말아주세요.
  const requestHeaders = new Headers(request.headers);
  console.log("[middleware] DB에서 불러온 id:", dbUid.id)
  requestHeaders.set('X-User-ID', dbUid.id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"], // 모든 api 경로에 미들웨어 적용
};
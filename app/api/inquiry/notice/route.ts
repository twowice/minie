import { supabase } from "@/lib/supabase";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail";

/* 조회 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const months = Number(searchParams.get("months"));
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const isAdmin = searchParams.get("is_admin");
  const uid = req.headers.get('X-User-ID');
  if (uid === null || uid === "") {
    return Response.json({ error: "Unauthorized: No user info" }, { status: 401 })
  }

  /* 전체 문의 가져오기 */
  let query = supabase
    .from("inquiry")
    .select(`
        id,
        user_id,
        inquiry_type,
        content,
        image_url,
        reply_email,
        created_at,
        answer
        `)
    .order("created_at", { ascending: false });

  /* 관리자 유무 확인 */
  if (isAdmin !== "true") query = query.eq("user_id", Number(uid));

  /* 월 버튼 필터링 */
  let fromDate = null;
  if (months) {
    if (!isNaN(months) && months > 0) {
      const now = new Date();
      fromDate = new Date(now.setMonth(now.getMonth() - months)).toISOString();
    }
  }

  if (start && end) query = query.gte("created_at", start).lte("created_at", end);

  if (fromDate) query = query.gte("created_at", fromDate);

  const { data, error } = await query;
  if (error) return Response.json({ message: "문의 조회 실패", error: error.message }, { status: 500 });

  return Response.json({
    message: "문의 조회 성공",
    data: data,
  });
}

/* 업데이트 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const content = formData.get("content") as string;
    const uid = req.headers.get('X-User-ID');
    if (uid === null || uid === "") {
      return Response.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }

    console.log("=== POST 요청 데이터 ===");
    console.log("id:", id);
    console.log("content:", content);

    /* 예외 처리 */
    if (!id) {
      return Response.json(
        { message: "필수 데이터 누락" },
        { status: 400 }
      );
    }

    /* 답변 DB 업로드 */
    const { data, error } = await supabase
      .from("inquiry")
      .update({
        answer: content
      })
      .eq("id", id)
      .select();

    /* 문의 내용 조회 */
    const inquiryRes = await supabase
      .from("inquiry")
      .select("id, answer, inquiry_type, reply_email, content")
      .eq("id", id)
      .single();

    if (inquiryRes.error || !inquiryRes.data) {
      return Response.json({ message: "문의 정보를 찾을 수 없음" }, { status: 404 });
    }
    const inquiry = inquiryRes.data;

    /* 이메일 전송 */
    try {
      await sendMail(
        inquiry.reply_email,
        `[답변] ${inquiry.inquiry_type}`,
        `
        <div style="font-family: Arial; padding: 20px;">
          <h2>📩 문의하신 내용에 대한 답변이 등록되었습니다.</h2>
          <p><strong>문의 내용:</strong></p>
          <div style="padding: 15px; background: #f6f6f6; border-radius: 8px;">
            ${inquiry.content}
          </div>
          <p><strong>답변 내용:</strong></p>
          <div style="padding: 15px; background: #f6f6f6; border-radius: 8px;">
            ${inquiry.answer}
          </div>
          <br />
          <p>확인해 주셔서 감사합니다.</p>
        </div>
        `
      );

      console.log("이메일 발송 완료");
    } catch (e: any) {
      console.error("이메일 전송 실패:", e)
    }
    return Response.json({ message: "답변 저장 및 이메일 발송 완료" })
  } catch (err: any) {
    return Response.json(
      { message: "서버 에러", error: err.message },
      { status: 500 }
    );
  }
}

/* 삭제 */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ message: "삭제할 문의 ID가 필요합니다." }, { status: 400 });

    const { data: oldReview, error: oldError } = await supabase
      .from("inquiry")
      .select("image_url")
      .eq("id", id)
      .single();

    if (oldError) return Response.json({ message: "문의 조회 실패", error: oldError.message }, { status: 500 });

    if (oldReview?.image_url) {
      const oldImagePath = path.join(process.cwd(), "public", oldReview.image_url);
      try { await unlink(oldImagePath); }
      catch (e) { console.warn("기존 이미지 삭제 실패:", e); }
    }

    const { error: delError } = await supabase
      .from("inquiry")
      .delete()
      .eq("id", id);

    if (delError) {
      return Response.json({ message: "답변 삭제 실패", error: delError.message }, { status: 500 });
    }
    return Response.json({ message: "답변 삭제 성공" });

  } catch (err: any) {
    return Response.json(
      { message: "서버 에러", error: err.message },
      { status: 500 }
    );
  }
}

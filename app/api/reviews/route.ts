import { supabase } from "@/lib/supabase";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

/* 조회 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "5");
  const sortType = url.searchParams.get("sort") || "latest";
  const photo = url.searchParams.get("photo") === "true";
  const normal = url.searchParams.get("normal") === "true";
  const productId = url.searchParams.get("product_id");
  const userId = url.searchParams.get("user_id");

  /* 전체 리뷰 가져오기 */
  let query = supabase
    .from("reviews")
    .select(`
      id,
      rating,
      content,
      image_url,
      created_at,
      user_id,
      product_id,
      users (
        name,
        profile_image
      ),
      products (
        name,
        image
      )
    `);
  if (userId) query = query.eq("user_id", userId)
  if (productId) query = query.eq("product_id", productId);
  const { data: allReviews, error: allError } = await query;
  if (allError) return Response.json({ message: "전체 리뷰 조회 실패", error: allError.message }, { status: 500 });

  /* 필터 & 정렬*/
  let filtered = [...allReviews];
  if (photo && !normal) filtered = filtered.filter((r) => r.image_url);
  if (!photo && normal) filtered = filtered.filter((r) => !r.image_url)
  if (sortType === "latest") filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  else if (sortType === "rating") filtered.sort((a, b) => b.rating - a.rating);

  /* 페이지네이션 */
  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filtered.slice(start, end);

  /* 평균 점수 및 그래프 */
  const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
  const rating = +(totalRating / allReviews.length).toFixed(1);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allReviews.forEach(r => {
    const score = Math.round(r.rating);
    if (score >= 1 && score <= 5) distribution[score] += 1;
  });
  Object.keys(distribution).forEach(k => {
    distribution[k] = Math.round((distribution[k] / allReviews.length) * 100);
  });

  return Response.json({
    message: "리뷰 조회 성공",
    totalCount,
    rating,
    distribution,
    data: pageData,
  });
}

/* 추가 & 수정 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const rating = Number(formData.get("rating"));
    const content = formData.get("content") as string;
    const user_id = formData.get("user_id") as string;
    const product_id = formData.get("product_id") as string;
    const image = formData.get("image") as File | null;
    const imageUrl = formData.get("imageUrl") as string;
    const uid = req.headers.get('X-User-ID');
    if (uid === null || uid === "") {
      return Response.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }

    console.log("=== POST 요청 데이터 ===");
    console.log("id:", id);
    console.log("rating:", rating);
    console.log("content:", content);
    console.log("user_id:", user_id);
    console.log("product_id:", product_id);
    console.log("imageUrl:", imageUrl);
    console.log("image:", image ? { name: image.name, size: image.size } : null);

    /* 예외 처리 */
    if (!rating || !content || !product_id) {
      return Response.json(
        { message: "필수 데이터 누락" },
        { status: 400 }
      );
    }

    let image_url = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/images/review");
      await mkdir(uploadDir, { recursive: true });

      // 중복 방지
      const fileName = `${Date.now()}_${image.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      image_url = `/images/review/${fileName}`;
    }

    /* 수정 | 추가 판단 */
    let result;
    let action: "update" | "insert";

    // 수정일 경우
    if (id) {
      const { data: oldReview, error: oldError } = await supabase
        .from("reviews")
        .select("image_url")
        .eq("id", id)
        .single();

      if (oldError) {
        return Response.json(
          { message: "기존 리뷰 조회 실패", error: oldError.message },
          { status: 500 }
        );
      }

      // 기존 이미지 삭제
      let finalImageURL = oldReview?.image_url || null;
      if (image || imageUrl == "") {
        if (oldReview?.image_url) {
          const oldImagePath = path.join(process.cwd(), "public", oldReview.image_url);

          try { await unlink(oldImagePath); }
          catch (e) { console.warn("기존 이미지 삭제 실패:", e); }
        }
        finalImageURL = image_url;
      }

      // DB UPDATE
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          content,
          image_url: finalImageURL,
          user_id: Number(user_id),
          product_id: Number(product_id),
          created_at: new Date()
        })
        .eq("id", id)
        .select();

      if (error) return Response.json({ message: "리뷰 수정 실패", error: error.message }, { status: 500 });

      result = data;
      action = "update";
    }
    // 추가일 경우
    else {
      // DB INSERT
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            rating,
            content,
            image_url: image_url || "",
            user_id: uid,
            product_id: Number(product_id)
          }
        ])
        .select();

      if (error) return Response.json({ message: "리뷰 추가 실패", error: error.message }, { status: 500 });

      result = data;
      action = "insert";
    }

    return Response.json({
      message: `리뷰 ${action === "update" ? "수정" : "추가"} 성공`,
      result,
    });

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
    if (!id) return Response.json({ message: "삭제할 리뷰 ID가 필요합니다." }, { status: 400 });

    const { data: oldReview, error: oldError } = await supabase
      .from("reviews")
      .select("image_url")
      .eq("id", id)
      .single();

    if (oldError) return Response.json({ message: "리뷰 조회 실패", error: oldError.message }, { status: 500 });

    if (oldReview?.image_url) {
      const oldImagePath = path.join(process.cwd(), "public", oldReview.image_url);
      try { await unlink(oldImagePath); }
      catch (e) { console.warn("기존 이미지 삭제 실패:", e); }
    }

    const { error: delError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (delError) {
      return Response.json({ message: "리뷰 삭제 실패", error: delError.message }, { status: 500 });
    }
    return Response.json({ message: "리뷰 삭제 성공" });

  } catch (err: any) {
    return Response.json(
      { message: "서버 에러", error: err.message },
      { status: 500 }
    );
  }
}
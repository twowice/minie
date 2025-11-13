import { supabase } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "5");
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 전체 리뷰 통계 가져오기
  const { data: allReviews, error: allError } = await supabase
    .from("reviews")
    .select("rating", { count: "exact" });

  if (allError) {
    return Response.json({ message: "전체 리뷰 조회 실패", error: allError.message }, { status: 500 });
  }

  const totalCount = allReviews.length || 0;
  const totalRating = allReviews.reduce((acc, review) => acc + review.rating, 0);
  const rating = +(totalRating / totalCount).toFixed(1);

  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  allReviews.forEach((review) => {
    const r = Math.round(review.rating);
    if (r >= 1 && r <= 5) {
      distribution[r] += 1;
    }
  });

  Object.keys(distribution).forEach((key) => {
    distribution[+key] = Math.round((distribution[+key] / totalCount) * 100);
  })

  // 페이지네이션 리뷰(5개 씩) 가져오기
  const { data, error } = await supabase
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
    `
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return Response.json(
      { message: "리뷰 조회 실패", error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return Response.json({ message: "데이터가 없습니다." }, { status: 404 });
  }

  return Response.json({
    message: "리뷰 조회 성공",
    totalCount,
    rating,
    distribution,
    data: data || [],
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const rating = Number(formData.get("rating"));
    const content = formData.get("content") as string;
    const user_id = formData.get("user_id") as string;
    const product_id = formData.get("product_id") as string;
    const image = formData.get("image") as File | null;

    console.log("=== POST 요청 데이터 ===");
    console.log("id:", id);
    console.log("rating:", rating);
    console.log("content:", content);
    console.log("user_id:", user_id);
    console.log("product_id:", product_id);
    console.log("image:", image ? { name: image.name, size: image.size } : null);

    if (!rating || !content || !user_id || !product_id) {
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

      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      image_url = `/images/review/${fileName}`;
    }

    let result;
    let action: "update" | "insert";
    
    if (id) {
      console.log("image_url:", image_url)
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          content,
          image_url: image_url || "",
          user_id: Number(user_id),
          product_id: Number(product_id)
        })
        .eq("id", id)
        .select();
      if (error) {
        return Response.json({ message: "리뷰 수정 실패", error: error.message }, { status: 500 });
      }

      result = data;
      action = "update";
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            rating,
            content,
            image_url: image_url || "",
            user_id: Number(user_id),
            product_id: Number(product_id)
          }
        ])
        .select();

      if (error) {
        return Response.json(
          { message: "리뷰 추가 실패", error: error.message },
          { status: 500 }
        );
      }
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
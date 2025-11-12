import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      content,
      image_url,
      created_at,
      users (
        name,
        profile_image
      ),
      products (
        name,
        image
      )
    `)
    .order("created_at", { ascending: false })
    .limit(20);

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
    data: data,
  });
}

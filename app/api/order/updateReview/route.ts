import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { id } = await req.json();
        const { data, error } = await supabase
            .from("order_details")
            .update({ has_review: true })
            .eq("id", id)

        if (error) return NextResponse.json({ message: "업데이트 실패", error: error.message }, { status: 500 });
        return NextResponse.json({
            message: "업데이트 성공", data
        });
    } catch (err: any) {
        return NextResponse.json(
            { message: "서버 에러", error: err.message },
            { status: 500 }
        );
    }
}
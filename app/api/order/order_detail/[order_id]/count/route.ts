import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { order_id: string } }) {
    const { order_id: orderId } = await params
    const itemsPerPage = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10)

    const { count, error } = await supabase
        .from('order_details')
        .select('*', { count: 'exact', head: true })
        .eq('order_number', orderId)

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch order_details count' }, { status: 500 });
    }
    const totalCount = count || 0

    return NextResponse.json({
        totalCount: totalCount,
        itemsPerPage: itemsPerPage,
        totalPages: Math.ceil(totalCount / itemsPerPage)
    }, { status: 200 })
}
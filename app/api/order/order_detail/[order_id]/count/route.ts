import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { order_id: string } }) {
    const orderId = params.order_id

    const { count, error } = await supabase
        .from('order_details')
        .select('id', { count: 'exact', head: true })
        .eq('order_number', orderId)

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch order_details count' }, { status: 500 });
    }

    return NextResponse.json({
        totalCount: count || 0
    })
}
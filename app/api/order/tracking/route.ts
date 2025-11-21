import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { OrdersForTracking } from "../order";

export async function GET(request: NextRequest) {
    const uid = request.headers.get('X-User-ID')
    if (uid === null || uid === "") {
        return NextResponse.json({ error: 'Unauthorized: No user info' }, { status: 401 })
    }

    const { data: rawOrderDatas, error } = await supabase
        .from('orders')
        .select(`
            order_number,
            total_price,
            created_at,
            updated_at,
            status,
            order_name
            `)
        .eq('user_id', Number(uid))
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch order summary for mypage: ' + error.message }, { status: 500 })
    }
    if (rawOrderDatas === null || rawOrderDatas.length === 0) {
        return NextResponse.json([], { status: 200 });
    }


    const typedOrderDatas: OrdersForTracking[] = rawOrderDatas.map((order: any) => ({
        orderId: order.order_number,
        orderName: order.order_name,
        totalPrice: order.total_price,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at
    }));

    return NextResponse.json(typedOrderDatas, { status: 200 })
}
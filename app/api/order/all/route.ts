import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { OrderForManage } from "../order";
import { isAdminUserByIdAsAdmin } from "@/lib/minie/authAPI.server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order-id')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const userName = searchParams.get('name')
    const status = searchParams.get('status')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit - 1

    try {
        let query = supabase
            .from('orders')
            .select(`
                order_number,
                users(name),
                created_at,
                order_name,
                total_price,
                status
            `)

        if (orderId) {
            query = query.ilike('order_number', `%${orderId}%`)
        }

        if (userName) {
            query = query.ilike('users.name', `%${userName}%`)
        }

        if (status) {
            query = query.eq('status', status);
        }
        if (startDate) {
            query = query.gte('created_at', startDate);
        }
        if (endDate) {
            const nextDay = new Date(endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            query = query.lt('created_at', nextDay.toISOString().split('T')[0]);
        }


        query = query.order('created_at', { ascending: false })

        const { data: rawOrders, error: error } = await query.range(startIndex, endIndex)

        if (error) {
            console.error("Error fetching order details:", error)
            throw new Error(`Failed to fetch order details: ${error.message}`)
        }

        if (rawOrders === null || rawOrders.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const typedOrders: OrderForManage[] = rawOrders.map((item: any) => {
            const userName = item.users ? item.users.name : 'Unknown User';
            return {
                id: item.order_number,
                user: userName,
                date: item.created_at,
                orderName: item.order_name,
                totalPrice: item.total_price,
                status: item.status
            }
        });

        return NextResponse.json(typedOrders, { status: 200 })
    } catch (error) {
        console.error("API /api/order/all GET Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const uid = request.headers.get('X-User-ID');

    console.log(`[server] api/order/all PATCH \tuid: ${uid}`)
    if (uid === null || uid === "") {
        return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }
    const isAdmin = await isAdminUserByIdAsAdmin(Number(uid))
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized: user is not admin" }, { status: 404 })
    }

    const { order_id: orderId, order_status: status } = await request.json()

    try {
        const { error } = await supabase
            .from('orders')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('order_number', orderId);

        if (error) {
            console.error("Error patching order's status", error);
            throw new Error(`Failed to update order's status: ${error}`);
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API /api/orders PATCH Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }

}
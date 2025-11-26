import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order-id');
    const userName = searchParams.get('name');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    try {
        // When filtering on a related table (users), it must be included in the select.
        // For a count query, referencing it with !inner is necessary if the filter key is on the related table.
        const selectString = userName ? 'order_number, users!inner(name)' : 'order_number';

        let query = supabase
            .from('orders')
            .select(selectString, { count: 'exact', head: true });

        if (orderId) {
            query = query.ilike('order_number', `%${orderId}%`);
        }
        if (userName) {
            query = query.ilike('users.name', `%${userName}%`);
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

        const { count, error } = await query;

        if (error) {
            console.error("Error fetching order details count:", error.message);
            throw new Error(`Failed to fetch order details count: ${error.message}`);
        }

        const totalPages = Math.ceil((count || 0) / limit);

        return NextResponse.json({
            totalCount: count || 0,
            itemsPerPage: limit,
            totalPages: totalPages
        }, { status: 200 });

    } catch (error) {
        console.error("API /api/order/all/count GET Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
    }
}

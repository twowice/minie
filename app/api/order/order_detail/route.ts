import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { OrderDetail } from "../order";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order-id')

    if (!orderId) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 })
    }

    try{
        const { data: orderDetails, error } = await supabase
            .from('order_details')
            .select('*')
            .eq('order_number', orderId)
    
        if (error) {
            console.error("Error fetching order details:", error);
            if (error.code === 'PGRST116') {
                return NextResponse.json({ message: 'Order details not found' }, { status: 404 });
            }
            throw new Error(`Failed to fetch order details: ${error.message}`);
        }

        const typedRawOrderDetails : OrderDetail[] | undefined = orderDetails?.map(item => ({
            productId: item.product_id,
            productNum: item.product_num,
            price: item.price,
            is_discount: item.is_discount,
            discountAmount: item.discount_amount
        }))

        return NextResponse.json(typedRawOrderDetails ? typedRawOrderDetails : [], { status: 200 })
    }catch(error){
        console.error("API /api/order/order_detail GET Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}
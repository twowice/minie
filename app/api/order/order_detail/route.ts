import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { OrderDetail } from "../order";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order-id')
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    if (!orderId) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 })
    }

    try {
        const { data: orderDetails, error } = await supabase
            .from('order_details')
            .select(`
                id,
                product_id,
                product_num,
                price,
                is_discounted,
                discount_amount,
                products(name, image),
                has_review
                `)
            .eq('order_number', orderId)
            .range(startIndex, endIndex)

        if (error) {
            console.error("Error fetching order details:", error);
            if (error.code === 'PGRST116') {
                return NextResponse.json({ message: 'Order details not found' }, { status: 404 });
            }
            throw new Error(`Failed to fetch order details: ${error.message}`);
        }

        if (orderDetails === null || orderDetails.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const typedOrderDetails: OrderDetail[] = orderDetails.map((item: any) => {
            const product = item.products as { name: string; image: string; } | null;

            return {
                id: item.id,
                productId: item.product_id,
                productNum: item.product_num,
                price: item.price,
                isDiscounted: item.is_discounted,
                discountAmount: item.discount_amount,
                productName: product?.name || '알 수 없는 상품',
                productImage: product?.image || "/images/review/product3.jpg",
                has_review: item.has_review // add by ckh
            }
        });

        return NextResponse.json(typedOrderDetails, { status: 200 })
    } catch (error) {
        console.error("API /api/order/order_detail GET Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}
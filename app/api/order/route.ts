import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { CartItem } from "../cart/cart";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order-id')

    const uid = request.headers.get('X-User-ID');

    if (uid === null || uid === "") {
        return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }

    if (!orderId) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 })
    }

    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_number', orderId)
            .eq('user_id', Number(uid))
            .single()

        if (error) {
            console.error("Error fetching order:", error);
            if (error.code === 'PGRST116') {
                return NextResponse.json({ message: 'Order not found' }, { status: 404 });
            }
            throw new Error(`Failed to fetch order: ${error.message}`);
        }

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            orderId: order.order_number,
            orderName: order.order_name,
            paymentType: order.payment_type,
            totalPrice: order.total_price,
            totalDiscountAmount: order.total_discount_amount,
            status: order.status,
            createdAt: order.created_at
        }, { status: 200 });

    } catch (error) {
        console.error("API /api/order GET Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { order_id, order_name, payment_type, total_price, total_discount_amount, cart_items } = await request.json();
        const uid = request.headers.get('X-User-ID');

        if (uid === null || uid === "") {
            return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
        }

        if (!order_id || !total_price || !cart_items || cart_items.length === 0) {
            return NextResponse.json({ message: 'Missing required order details' }, { status: 400 });
        }
        const time = new Date().toISOString()

        const { error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: order_id,
                order_name: order_name,
                user_id: Number(uid),
                payment_type: payment_type,
                total_price: total_price,
                total_discount_amount: total_discount_amount,
                created_at: time,
                updated_at: time,
                status: '결제 전'
                // 주문 상태 컬럼 추가했습니다. redirect된 토스 api에서 돌아와서 cartitem을 db로 보내줄 수 없어서 이후 status를 업데이트하는 방향으로 틀었습니다.
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error inserting order:", orderError);
            throw new Error(`Failed to create order: ${orderError.message}`);
        }

        //상세 상품 정보 삽입
        const orderDetailsToInsert = cart_items.map((item: CartItem) => ({
            order_number: order_id,
            product_id: item.id,
            product_num: item.num,
            price: item.price,
            is_discounted: item.isDiscounted,
            discount_amount: item.discountAmount,
        }));

        const { error: orderDetailsError } = await supabase
            .from('order_details')
            .insert(orderDetailsToInsert);

        if (orderDetailsError) {
            console.error("Error inserting order details:", orderDetailsError);
            throw new Error(`Failed to create order details: ${orderDetailsError.message}`);
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("API /api/orders POST Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const uid = request.headers.get('X-User-ID');

        console.log(`[server] api/order PATCH \tuid: ${uid}`)

        if (uid === null || uid === "") {
            return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
        }

        const { order_id: orderId, payment_type: paymentType, order_status: status } = await request.json()

        console.log(`[server] api/order PATCH \torder_id : ${orderId}\tpayment_type: ${paymentType}\torder_status: ${status}`)

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: status,
                payment_type: paymentType,
                updated_at: new Date().toISOString()
            })
            .eq('order_number', orderId);

        if (updateError) {
            console.error("Error pathing order details:", updateError);
            throw new Error(`Failed to update order details: ${updateError}`);
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API /api/orders PATCH Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { order_id: orderId } = await request.json()

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('order_number', orderId)

        if (error) {
            console.error("Error pathing order details:", error);
            throw new Error(`Failed to update order details: ${error}`);
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("API /api/orders Delete Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}
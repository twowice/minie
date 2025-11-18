import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { CartItem } from "../cart/cart";

export async function POST(request: Request) {
    try {
        const { order_id, order_name, payment_type, total_price, total_discount_amount, cart_items } = await request.json();

        const tempUid = 1 //TODO: user id 전역 관리 가능해지면 가져오기

        if (!order_id || !total_price || !cart_items || cart_items.length === 0) {
            return NextResponse.json({ message: 'Missing required order details' }, { status: 400 });
        }

        const { error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: order_id,
                order_name: order_name,
                user_id: tempUid,
                payment_type: payment_type,
                total_price: total_price,
                total_discount_amount: total_discount_amount,
                created_at: new Date().toISOString(),
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

        return NextResponse.json({ message: 'Order created successfully', orderNumber: order_id }, { status: 201 });

    } catch (error) {
        console.error("API /api/orders POST Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest){
    try{
        const {order_id: orderId, payment_type: paymentType} = await request.json() 

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: '주문 완료',
                payment_type: paymentType,
            })
            .eq('order_number', orderId);

       if(updateError){
            console.error("Error pathing order details:", updateError);
            throw new Error(`Failed to update order details: ${updateError}`);
       }
    }catch(error){
        console.error("API /api/orders PATCH Error:", error);
        return NextResponse.json({ message: error || 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    
}
import { getOrderDetails } from '@/lib/minie/orderAPI';
import { deleteOrderAsAdmin, getOrderAsAdmin, updateOrderStatusAsAdmin } from '@/lib/minie/orderAPI.server';
import { deleteCartItemsAsAdmin } from '@/lib/minie/cartAPI.server';
import { NextRequest, NextResponse } from 'next/server';
import { OrderDetail } from '@/app/api/order/order.d';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount')

    if (!orderId) {
        // orderId가 없는 경우 즉시 실패 처리
        console.error('Toss Payments callback missing orderId.');
        return NextResponse.redirect(new URL(`/payment/fail?message=필수 주문 ID 누락`, request.nextUrl.origin));
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    // 필수 파라미터가 없거나 시크릿 키가 없는 경우 에러 처리
    if (!paymentKey || !amount || !secretKey) {
        console.error('필수 결제 파라미터 또는 시크릿 키 누락', { paymentKey, orderId, amount, secretKeyExists: !!secretKey });
        return NextResponse.redirect(new URL(`/payment/fail?message=필수 결제 파라미터 누락&orderId=${orderId}`, request.nextUrl.origin));
    }

    try {
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount: Number(amount)
            }),
        });

        const json = await response.json()

        if (!response.ok) {
            console.error("토스페이먼츠 승인 실패:", json);
            const errorMessage = json.message || 'Payment confirmation failed with unknown reason';
            // 결제 승인에 실패했으므로, 주문 상태를 '주문실패'로 업데이트 할 수도 있습니다.
            // await updateOrderStatusAsAdmin(orderId, '카드', '주문실패');
            return NextResponse.redirect(new URL(`/payment/fail?message=${errorMessage}&orderId=${orderId}`, request.nextUrl.origin));
        }

        console.log("결제 승인 성공:", json);

        const isUpdateSuccess = await updateOrderStatusAsAdmin(orderId, json.easyPay?.provider || '카드', '주문완료')

        if(!isUpdateSuccess){
            console.error("결제 후 주문 데이터 업데이트 과정에서 문제 발생 ", orderId)
            await deleteOrderAsAdmin(orderId); // 실패 시 생성된 주문 삭제
            return NextResponse.redirect(new URL(`/payment/fail?message=Internal server error during updating order status&orderId=${orderId}`, request.nextUrl.origin))
        }

        console.log(`주문 ${orderId}의 장바구니 상품 삭제를 시작합니다.`);
        
        const order = await getOrderAsAdmin(orderId);
        if (!order) {
            console.error(`[Fatal] Cannot find order ${orderId} to clear cart items. Proceeding without cart deletion.`);
            // 주문은 성공했으므로 계속 진행하되, 심각한 오류임을 기록
            return NextResponse.redirect(new URL(`/orderfinish?order-id=${orderId}`, request.nextUrl.origin));
        }

        const orderDetails : OrderDetail[] = await getOrderDetails(orderId);
        const productIdsToDelete = orderDetails.map(detail => detail.productId);

        const allItemsCleared = await deleteCartItemsAsAdmin(order.user_id, productIdsToDelete);

        if (!allItemsCleared) {
            console.warn(`주의: 주문 ${orderId}의 일부 또는 전체 장바구니 상품 삭제 실패`);
        } else {
            console.log(`주문 ${orderId}의 장바구니 상품 모두 삭제 성공`);
        }
        return NextResponse.redirect(new URL(`/orderfinish?order-id=${orderId}`, request.nextUrl.origin));

    } catch (err) {
        console.error("결제 승인 중 예외 발생:", err);
        await deleteOrderAsAdmin(orderId);
        const errorMessage = (err instanceof Error) ? err.message : 'Internal server error during payment confirmation';
        return NextResponse.redirect(new URL(`/payment/fail?message=${errorMessage}&orderId=${orderId}`, request.nextUrl.origin));
    }
}
import { deleteOrder, getOrderDetails, updateOrderStatus } from '@/lib/minie/orderAPI';
import { NextRequest, NextResponse } from 'next/server';
import { OrderDetail } from '../../order/order';
import { deleteCartItem } from '@/lib/minie/cartAPI';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount')

    const secretKey = process.env.TOSS_SECRET_KEY;

    // 필수 파라미터가 없거나 시크릿 키가 없는 경우 에러 처리
    if (!paymentKey || !orderId || !amount || !secretKey) {
        console.error('필수 결제 파라미터 또는 시크릿 키 누락', { paymentKey, orderId, amount, secretKeyExists: !!secretKey });
        // 에러 메시지와 함께 실패 페이지로 리다이렉트
        return NextResponse.redirect(new URL(`/fail`, request.nextUrl.origin));
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
            deleteOrder(orderId)
            const errorMessage = json.message || 'Payment confirmation failed with unknown reason';
            return NextResponse.redirect(new URL(`payment/fail?message=${errorMessage}&orderId=${orderId}`, request.nextUrl.origin));
        }

        console.log("결제 승인 성공:", json);

        //결제전->주문완료 상태 변화
        const isUpdateSuccess = await updateOrderStatus(orderId, json.easyPay.provider, '주문완료')

        if(!isUpdateSuccess){
            console.error("결제 후 주문 데이터 업데이트 과정에서 문제 발생 ", orderId)
            deleteOrder(orderId)
            return NextResponse.redirect(new URL(`payment/fail?message=Internal server error during updating order status`, request.nextUrl.origin))
        }

        //장바구니 비우기 시작
        const orderDetails : OrderDetail[]= await getOrderDetails(orderId)

       const deletePromises = orderDetails.map(detail => 
                deleteCartItem(detail.productId)
        )

        const results = await Promise.all(deletePromises)
        const allItemsCleared = results.every(result => result === true);

            if (!allItemsCleared) {
                console.warn(`주의: 주문 ${orderId}의 일부 장바구니 상품 삭제 실패`);
            } else {
                console.log(`주문 ${orderId}의 장바구니 상품 모두 삭제 성공`);
            }


        return NextResponse.redirect(new URL(`/orderfinish?order-id=${orderId}`, request.nextUrl.origin));

    } catch (error) {
        deleteOrder(orderId)
        console.error("결제 승인 중 예외 발생:", error);
        return NextResponse.redirect(new URL(`payment/fail?message=Internal server error during payment confirmation`, request.nextUrl.origin));
    }
}
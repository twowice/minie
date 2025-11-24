import 'server-only';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { OrderDetail } from '@/app/api/order/order';

export type AdminOrder = {
    order_number: string;
    user_id: number;
}

//서버용 API 통신 함수
/*
        토스페이측에서 결제 요청 처리 후 다시 minie(server)쪽으로 요청을 전달하기에 서버용 인증이 필요없는 함수를 준비했습니다.

*/
export async function getOrderAsAdmin(orderId: string): Promise<AdminOrder | null> {
    const supabase = getSupabaseAdminClient();
    try {
        console.log(`[Admin] Fetching order: ${orderId}`);
        const { data: order, error } = await supabase
            .from('orders')
            .select('order_number, user_id')
            .eq('order_number', orderId)
            .single();

        if (error) {
            console.error(`[Admin] Error fetching order ${orderId}:`, error);
            return null;
        }

        return order;
    } catch (error) {
        console.error(`[Admin] Exception while fetching order ${orderId}:`, error);
        return null;
    }
}

export async function updateOrderStatusAsAdmin(orderId: string, paymentType: string, status: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    try {
        console.log(`[Admin] Updating order: ${orderId} to status: ${status}`);
        const { error } = await supabase
            .from('orders')
            .update({
                status: status,
                payment_type: paymentType,
                updated_at: new Date().toISOString()
            })
            .eq('order_number', orderId);

        if (error) {
            console.error("[Admin] Error updating order status:", error);
            return false;
        }
        console.log(`[Admin] Successfully updated order: ${orderId}`);
        return true;
    } catch (error) {
        console.error("[Admin] Exception during order status update:", error);
        return false;
    }
}

export async function deleteOrderAsAdmin(orderId: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    try {
        console.log(`[Admin] Deleting order: ${orderId}`);
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('order_number', orderId);

        if (error) {
            console.error("[Admin] Error deleting order:", error);
            return false;
        }

        console.log(`[Admin] Successfully deleted order: ${orderId}`);
        return true;
    } catch (error) {
        console.error("[Admin] Exception during order deletion:", error);
        return false;
    }
}

export async function getOrderDetailsAsAdmin(orderId: string): Promise<OrderDetail[]> {
    const supabase = getSupabaseAdminClient()
    try {
        const { data: orderDetails, error } = await supabase
            .from('order_details')
            .select(`
                        product_id,
                        product_num,
                        price,
                        is_discounted,
                        discount_amount,
                        products(name, image)
                        `)
            .eq('order_number', orderId)

        if (error) {
            console.error("Error fetching order details:", error);
            if (error.code === 'PGRST116') {
                throw new Error('order details not found:', error)
            }
            throw new Error(`Failed to fetch order details: ${error.message}`);
        }

        if (orderDetails === null || orderDetails.length === 0) {
            return []
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
            }
        });

        return typedOrderDetails

    } catch (error) {
        console.error('[Admin] Exception during order details getting,', error)
        return []
    }
}
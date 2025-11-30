import 'server-only';
import { getSupabaseAdminClient } from '@/lib/supabase';

//서버용 API 통신 함수
/*
        토스페이측에서 결제 요청 처리 후 다시 minie(server)쪽으로 요청을 전달하기에 서버용 인증이 필요없는 함수를 준비했습니다.

*/

export async function deleteCartItemsAsAdmin(userId: number, productIds: number[]): Promise<boolean> {
    if (!productIds || productIds.length === 0) {
        console.log('[Admin] No product IDs provided to delete from cart. Skipping.');
        return true;
    }

    const supabase = getSupabaseAdminClient();
    try {
        console.log(`[Admin] Deleting cart items for user: ${userId}, products: ${productIds.join(', ')}`);
        
        const { error } = await supabase
            .from('carts')
            .delete()
            .eq('user_id', userId)
            .in('product_id', productIds);

        if (error) {
            console.error(`[Admin] Error deleting cart items for user ${userId}:`, error);
            return false;
        }
        
        console.log(`[Admin] Successfully deleted ${productIds.length} cart items for user ${userId}.`);
        return true;
    } catch (error) {
        console.error(`[Admin] Exception during cart item deletion for user ${userId}:`, error);
        return false;
    }
}

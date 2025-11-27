import { getSupabaseAdminClient } from "../supabase";

export async function isAdminUserByIdAsAdmin(id: number): Promise<boolean> {
    try {
        const supabase = getSupabaseAdminClient()

        const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', id)
            .single()


        if (error) {
            console.error(`[Admin] Error checking is user(${id}) amdin user`, error);
            return false;
        }

        if (!data || data.is_admin === null || data.is_admin === undefined) {
            return false;
        }

        return data.is_admin as boolean
    } catch (error) {
        console.error(`[Admin] Exception during checking is user(${id}) amdin user`, error)
        return false
    }
}
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE() {
     const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {error} = await supabase
    .from('carts')
    .delete()
    .eq('user_id', tempUid)
    
    if(error){
        return NextResponse.json({ error: 'Failed to deleting cart item: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true })
}

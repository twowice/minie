import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     const uid = request.headers.get('X-User-ID');

    if(uid === null || uid === ""){
        return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }

    const {error} = await supabase
    .from('carts')
    .delete()
    .eq('user_id', Number(uid))
    
    if(error){
        return NextResponse.json({ error: 'Failed to delete all cart item: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

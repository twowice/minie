import { supabase } from "@/lib/supabase"
import { CartItem, RawCartItem } from "./cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {data: rawCartItems, error} = await supabase
    .from('carts')
    .select(`
        product_id,
        product_num,
        products (
            name,
            price,
            brand,
            image,
            is_discounted,
            discount_amount
        )`
    )
    .eq('user_id', tempUid)
    .order('id', { ascending: false })

    const typedRawCartItems: RawCartItem[] | null = rawCartItems as RawCartItem[] | null;


    if (error) {
        return NextResponse.json({ error: 'Failed to fetch cart items: ' + error.message }, { status: 500 });
    }

    if (!typedRawCartItems) {
        return NextResponse.json([], { status: 200 });
    }

    const transformedCartItems: CartItem[] = typedRawCartItems.map((item: RawCartItem) => {
        return {
            id: item.product_id,
            checked: true,
            isUpdated:false,
            title: item.products.name,
            brand: item.products.brand,
            image: (item.products.image || '').length !== 0 ? item.products.image : "images/review/product3.jpg",
            num: item.product_num,
            price: item.products.price,
            isDiscounted: item.products.is_discounted,
            discountAmount: item.products.discount_amount,
        };
    }).filter(item => item !== null) as CartItem[];

   return NextResponse.json(transformedCartItems, { status: 200 });
}

export async function DELETE(request: NextRequest) {
     const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {product_id:productId} = await request.json()

    const {error} = await supabase
    .from('carts')
    .delete()
    .eq('user_id', tempUid)
    .eq('product_id', productId)
    
    if(error){
        return NextResponse.json({ error: 'Failed to delete cart item: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
    const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const itemsToInsert: { product_id: number; product_num: number }[] = await request.json()
    const dataToInsert = itemsToInsert.map(item => ({
        user_id: tempUid,
        product_id: item.product_id,
        product_num: item.product_num
    }))


    const {error} = await supabase
    .from('carts')
    .insert(dataToInsert)

    if(error){
        return NextResponse.json({error: error.message }, { status: 400 });
    }

    return NextResponse.json({success: true})
}

export async function PATCH(request : NextRequest) {
     const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {product_id:id, product_num: num} = await request.json()

    const {error} = await supabase
    .from('carts')
    .update({product_num: num})
    .eq('user_id', tempUid)
    .eq('product_id', id)
    
    if(error){
        return NextResponse.json({error: error.message }, { status: 400 })
    }

    return NextResponse.json({success: true})
}
import { supabase } from "@/lib/supabase"
import { CartItem, RawCartItem } from "../cart/cart"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {data: rawCartItems, error} = await supabase
    .from('product_likes')
    .select(`
        product_id,
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

    const typedRawCartItems: RawCartItem[] | null = rawCartItems as RawCartItem[] | null


    if (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch liked items: ' + error.message }, { status: 500 })
    }

    if (!typedRawCartItems) {
        return NextResponse.json([], { status: 200 })
    }

    const transformedCartItems: CartItem[] = typedRawCartItems.map((item: RawCartItem) => {
        return {
            id: item.product_id,
            checked: true,
            isUpdated: false,
            title: item.products.name,
            brand: item.products.brand,
            image: (item.products.image || '').length !== 0 ? item.products.image : "images/review/product3.jpg" ,//추후 이미지 준비중인 상품 이미지 넣는 자리
            num: 1,
            price: item.products.price,
            isDiscounted: item.products.is_discounted,
            discountAmount: item.products.discount_amount,
        }
    }).filter(item => item !== null) as CartItem[]

   return NextResponse.json(transformedCartItems, { status: 200 })
}

export async function DELETE(request: NextRequest) {
    const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {product_id:productId} = await request.json()

    const {error} = await supabase
    .from('product_likes')
    .delete()
    .eq('user_id', tempUid)
    .eq('product_id', productId)
    
    if(error){
        return NextResponse.json({ error: 'Failed to delete liked item: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({success: true})
}

export async function POST(request: NextRequest) {
    const tempUid = 1

    const {product_id: productId} = await request.json()

    const {error} = await supabase
    .from('product_likes')
    .insert({user_id: tempUid, product_id: productId})

    if(error) {
        return NextResponse.json({error: 'Failed to insert liked item: ' + error.message}, {status: 500})
    }

    return NextResponse.json({success: true})
}
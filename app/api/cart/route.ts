import { supabase } from "@/lib/supabase"
import { CartItemProps, RawCartItem } from "./cart";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<CartItemProps[] | { error: string }>> {
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

    const typedRawCartItems: RawCartItem[] | null = rawCartItems as RawCartItem[] | null;


    if (error) {
        console.error('Error fetching cart items:', error);
        return NextResponse.json({ error: 'Failed to fetch cart items: ' + error.message }, { status: 500 });
    }

    if (!typedRawCartItems) {
        return NextResponse.json([], { status: 200 });
    }

    const transformedCartItems: CartItemProps[] = typedRawCartItems.map((item: RawCartItem) => {
        return {
            id: item.product_id,
            checked: false,
            title: item.products.name,
            brand: item.products.brand,
            image: item.products.image,
            num: item.product_num,
            price: item.products.price,
            isDiscounted: item.products.is_discounted,
            discountAmount: item.products.discount_amount,
        };
    }).filter(item => item !== null) as CartItemProps[];

   return NextResponse.json(transformedCartItems, { status: 200 });
}

export async function DELETE(request: Request) {
     const tempUid = 1
    /* TODO: getServerSession(authOption)와 같이 로그인 로직 완성시 얻는 uid 불러오기 로직 */

    const {productId} = await request.json()

    const {error} = await supabase
    .from('cart')
    .delete()
    .eq('user_id', tempUid)
    .eq('product_id', productId)
    
    if(error){
       console.error('Error deleting cart item', error);
        return NextResponse.json({ error: 'Failed to deleting cart item: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true })
}

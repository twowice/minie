export interface CartItem {
    id: number // product_id
    checked: boolean // 초기값 false
    isUpdated: boolean // num 값이 변했는가
    title: string // product.name
    brand: string // product.brand
    image: string // product.image
    num: number // product_num
    price: number // product.price
    isDiscounted: boolean // product.is_discounted
    discountAmount: number // product.discount_amount
}

interface RawCartItem {
    product_id: number
    product_num: number
    products: {
        name: string
        price: number
        brand: string
        image: string
        is_discounted: boolean
        discount_amount: number
  }
}

interface CartItemPayload{
    product_id: number
    product_num: number
}

interface CartItemUpdateResult {
  product_id: number
  success: boolean
  message?: string // 실패 메시지 포함 가능성 추가
}
export interface CartItem {
    id: number; // product_id
    checked: boolean; // 초기값 false
    title: string; // product.name
    brand: string; // product.brand
    image: string; // product.image
    num: number; // product_num
    price: number; // product.price
    isDiscounted: boolean; // product.is_discounted
    discountAmount: number; // product.discount_amount
}

interface RawCartItem {
    product_id: number;
    product_num: number;
    products: {
        name: string;
        price: number;
        brand: string;
        image: string;
        is_discounted: boolean;
        discount_amount: number;
  }
}
export interface Order {
    orderId: string,   //order_number
    orderName: string,
    paymentType: string,
    totalPrice: number,
    totalDiscountAmount: number,
    status: string,
    createdAt: string
    orderDetails?: OrderDetail[]
}

export interface OrderDetail {
    productId: number,
    productNum: number,
    price: number,          //가격은 구매 당시 가격을 저장하기 위해 존재합니다. product에 저장된 가격은 판매처의 재량에 따라 바뀔 수 있음
    isDiscounted: boolean,
    discountAmount: number
    productName: string,
    productImage: string,
    has_review: boolean // Add by CKH
}

export interface OrdersForTracking {
    orderId: string,
    orderName: string,
    status: string,
    totalPrice: number
    createdAt: string,
    updatedAt: string,
}

export type PaginatedOrderDetailsResponse = {
    items: OrderDetail[]
    totalCount: number
    currentPage: number
    totalPages: number
};
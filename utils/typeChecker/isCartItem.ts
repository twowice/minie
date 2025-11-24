//data의 타입이 CartItem 타입인지 title과 isUpdated 속성을 가지고 잇는지 유무로 판단합니다.
export function isTypedCartItem(data: any) {
    return typeof data === 'object' && data !== null && 'title' in data && 'isUpdated' in data
}
export function getDiscountRate(price:number, discountAmount: number){
    return Math.floor(discountAmount/price*100)
}

export function getFinalPrice(price:number, discountAmount: number) : number{
    return price - discountAmount
}
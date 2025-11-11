export function getDiscountRate(price:number, discountMount: number){
    return Math.floor(discountMount/price*100)
}

export function getFinalPrice(price:number, discountMount: number) : number{
    return price - discountMount
}
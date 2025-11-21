import { CartItem } from "@/app/api/cart/cart"
import { Order, OrderDetail } from "@/app/api/order/order.d"
import { fetchWithAuth } from "./authAPI"

export async function addNewOrder(
    orderId: string,
    orderName: string,
    paymentType: string,
    totalPrice: number,
    totalDiscountAmount: number,
    checkedCartItems: CartItem[],
): Promise<boolean> {
    try {
        const response = await fetchWithAuth("http://localhost:3000/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order_id: orderId,
                order_name: orderName,
                payment_type: paymentType,
                total_price: totalPrice,
                total_discount_amount: totalDiscountAmount,
                cart_items: checkedCartItems
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error(Error(errorData.error || "Failed to insert new order"))
            return false
        }

        return true
    } catch (error) {
        console.error("Error during new order insert :\n", orderId, paymentType)
        return false
    }

}

export async function updateOrderStatus(orderId: string, paymentType: string, status: string): Promise<boolean> {
    try {
        console.log(`[client] orderid: ${orderId}\tpaymentType: ${paymentType}]\tstatus: ${status}`)
        const response = await fetchWithAuth("http://localhost:3000/api/order", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId, payment_type: paymentType, order_status: status })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error(Error(errorData.error || "Failed to update order"))
            return false
        }

        console.log("[client] updateOrderStatus success")

        return true
    } catch (error) {
        console.error("Error during order status update :\n", orderId, paymentType)
        return false
    }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
    try {
        const response = await fetchWithAuth("http://localhost:3000/api/order", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error(Error(errorData.error || "Failed to update order"))
            return false
        }

        return true
    } catch (error) {
        console.error("Error during order delete :\n", orderId)
        return false
    }
}

export async function getOrderExcludeOrderDetail(orderId: string): Promise<Order | null> {
    try {
        const response = await fetchWithAuth(`http://localhost:3000/api/order?order-id=${orderId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            console.error(`Failed to get order: ${response.status} ${response.statusText}`);
            return null;
        }
        const order = response.json()

        return order

    } catch (error) {
        console.error("Error during getting order:", error);
        return null
    }
}

export async function getOrderDetails(orderId: string): Promise<OrderDetail[]> {
    try {
        const response = await fetch(`http://localhost:3000/api/order/order_detail?order-id=${orderId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            console.error(`Failed to get order: ${response.status} ${response.statusText}`);
            return [];
        }
        const order = await response.json()

        return order

    } catch (error) {
        console.error("Error during getting order:", error);
        return []
    }
}

export async function getOrdersForTracking() {
    try {
        const response = await fetchWithAuth('http://localhost:3000/api/order/tracking', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            console.error(`Failed to get order for tracking at mypage: ${response.status} ${response.statusText}`)
        }

        const orders = await response.json()

        return orders

    } catch (error) {
        console.error("Error during getting orders for tracking at mypage:", error)
        return []
    }
}


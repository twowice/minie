import { CartItem } from "@/app/api/cart/cart"
import { Order, OrderDetail, OrderForManage, PaginatedOrderDetailsResponse } from "@/app/api/order/order.d"
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

export async function updateOrderStatusAndPaymentType(orderId: string, paymentType: string, status: string): Promise<boolean> {
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

        console.log("[client] updateOrderStatusAndPaymentType success")

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

export async function updateOrderStatus(orderId: string) {

}

export async function getOrderDetails(orderId: string, page: number = 1, limit: number = 5): Promise<OrderDetail[]> {
    try {
        const response = await fetchWithAuth(`/api/order/order_detail?order-id=${orderId}&page=${page}&limit=${limit}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to get order details for ID ${orderId}: ${response.status} ${response.statusText}`, errorData);
            return []
        }

        const data: OrderDetail[] = await response.json();
        return data;

    } catch (error) {
        console.error(`Error during getting order details for ID ${orderId}:`, error);
        return []; // 에러 시 빈 응답 반환
    }
}

export async function getOrderDetailsCount(orderId: string, limit: number = 5): Promise<{ totalCount: number, itemsPerPage: number, totalPages: number }> {
    try {
        const response = await fetchWithAuth(`/api/order/order_detail/${orderId}/count?limit=${limit}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to get order details count for ID ${orderId}: ${response.status} ${response.statusText}`, errorData);
            return { totalCount: 0, itemsPerPage: limit, totalPages: 0 };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Error during getting order details count for ID ${orderId}:`, error);
        return { totalCount: 0, itemsPerPage: limit, totalPages: 0 };
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

export async function getAllOrders(
    filters: {
        orderId?: string,
        userName?: string,
        status?: string,
        startDate?: string,
        endDate?: string,
    },
    page: number = 1,
    limit: number = 5
): Promise<OrderForManage[]> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (filters.orderId) params.append('order-id', filters.orderId);
        if (filters.userName) params.append('name', filters.userName);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);

        const response = await fetchWithAuth(`/api/order/all?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to get orders for managing at delivery page for admin: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to get orders: ${response.statusText}`);
        }

        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error("Error during getting orders for managing at delivery page for admin:", error);
        return [];
    }
}

export async function getAllOrdersCount(
    filters: {
        orderId?: string,
        userName?: string,
        status?: string,
        startDate?: string,
        endDate?: string,
    },
    limit: number = 5
): Promise<{ totalCount: number, itemsPerPage: number, totalPages: number }> {
    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
        });

        if (filters.orderId) params.append('order-id', filters.orderId);
        if (filters.userName) params.append('name', filters.userName);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);

        const response = await fetchWithAuth(`/api/order/all/count?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to get orders count for admin: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to get orders count: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during getting orders count for admin:", error);
        return { totalCount: 0, itemsPerPage: limit, totalPages: 0 };
    }
}
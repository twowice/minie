import { CartItem } from "@/contexts/ShoppingCartContext";

export async function getCartItems(): Promise<CartItem[]> {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch cart items:", response.status, errorData);
      return [];
    }
    return (await response.json()) as CartItem[];
  } catch (error) {
    console.error("Error during cart items fetch:", error);
    return [];
  }
}

export async function deleteCartItem({id}:{id:number}) {
    
}
import { CartItem } from "@/contexts/ShoppingCartContext";

export async function getLikedItems(): Promise<CartItem[]> {
  try {
    const response = await fetch("http://localhost:3000/api/like", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch liked items:", response.status, errorData);
      return [];
    }
    return (await response.json()) as CartItem[];
  } catch (error) {
    console.error("Error during liked items fetch:", error);
    return [];
  }
}
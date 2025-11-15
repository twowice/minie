import { CartItemInsertPayload } from "@/app/api/cart/cart";
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
    console.error("Error during cart items getting:\n", error);
    return [];
  }
}

export async function deleteCartItem(id:number) : Promise<boolean> {
    try{
     const response = await fetch("http://localhost:3000/api/cart", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({product_id: id})
      })

      if(!response.ok){
        const errorData = await response.json();
        console.error(Error(errorData.error || "Failed to delete cart item"))
        return false
      }

      return true

    }catch(error){
      console.error("Error during cart items deleting:\n", error)
      return false
    }
}

export async function addCartItem(newItem:CartItemInsertPayload) : Promise<boolean> {
  return await addCartItems([newItem])
}
export async function addCartItems(newItems : CartItemInsertPayload[]) : Promise<boolean> {
  if(newItems.length ===0){
    console.log("There is not cart items to add")
    return true
  }
  
  try{
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(newItems)
    })

    if(!response.ok){
        const errorData = await response.json();
        console.error(Error(errorData.error || "Failed to insert cart items"))
        return false
      }

    return true
  }catch(error) {
    console.error("Error during cart items inserting:\n", error)
    return false
  }
}


export async function deleteAllCartItems() : Promise<boolean> {
  try{
    const response = await fetch("http://localhost:3000/api/cart/delete_all", {
      method:"DELETE",
      headers:{"Content-Type": "application/json"},
    })

    if(!response.ok){
        const errorData = await response.json();
        console.error(Error(errorData.error || "Failed to delete all cart items"))
        return false
      }

    return true
  }catch(error){
    console.error("Error during all cart items deleting :\n")
    return false
  }
  
}
import { CartItem } from "@/app/api/cart/cart"
import { fetchWithAuth } from "./authAPI"

export async function getLikedItems(): Promise<CartItem[]> {
  try {
    const response = await fetchWithAuth("http://localhost:3000/api/like", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[cartAPI-Client] Failed to fetch liked items:", response.status, errorData)
      return []
    }
    return (await response.json()) as CartItem[]
  } catch (error) {
    console.error("Error during liked items fetch:", error)
    return []
  }
}

export async function addLikedItem(id: number): Promise<boolean> {
  try{
    const response = await fetchWithAuth("http://localhost:3000/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({product_id: id})
    })

    if(!response.ok){
      const errorData = await response.json()
      console.error("Failed to insert liked item:", response.status, errorData)
      return false
    }
    return true
  }catch(error){
    console.error("Error during liked item adding")
    return false
  }
}

export async function deleteLikedItem(id: number): Promise<boolean> {
  try{
    const response = await fetchWithAuth("http://localhost:3000/api/like", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({product_id: id})
    })

    if(!response.ok){
      const errorData = await response.json()
      console.error("Failed to delete liked item:", response.status, errorData)
      return false
    }
    return true
  }catch(error){
    console.error("Error during liked item deleting")
    return false
  }
}

export async function deleteAllLikedItem(): Promise<boolean>{
  try{
    const response = await fetchWithAuth("http://localhost:3000/api/like/delete_all", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if(!response.ok){
      const errorData = await response.json()
      console.error("Failed to delete all liked item:", response.status, errorData)
      return false
    }
    return true
  }catch(error){
    console.error("Error during all liked item deleting")
    return false
  }
}
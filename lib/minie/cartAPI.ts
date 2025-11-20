import { CartItemPayload, CartItemUpdateResult } from "@/app/api/cart/cart"
import { CartItem } from "@/app/api/cart/cart"
import { fetchWithAuth } from "./authAPI";


//userId === supabase user 테이블의 id 
export async function getCartItems(): Promise<CartItem[]> {
  try {
    //쿼리를 통한 user id를 이용한 조회
    const response = await fetchWithAuth("http://localhost:3000/api/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[cartAPI-Client] Failed to fetch cart items:", response.status, errorData)
      return []
    }
    return (await response.json()) as CartItem[]
  } catch (error) {
    console.error("Error during cart items getting:\n", error)
    return []
  }
}

export async function deleteCartItem(id:number) : Promise<boolean> {
    try{
      //body
     const response = await fetchWithAuth("http://localhost:3000/api/cart", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({product_id: id})
      })

      if(!response.ok){
        const errorData = await response.json()
        console.error(Error(errorData.error || "Failed to delete cart item"))
        return false
      }

      return true

    }catch(error){
      console.error("Error during cart items deleting:\n", error)
      return false
    }
}

export async function addCartItem(newItem:CartItemPayload) : Promise<boolean> {
  return await addCartItems([newItem])
}
export async function addCartItems(newItems : CartItemPayload[]) : Promise<boolean> {
  if(newItems.length ===0){
    console.log("There is not cart items to add")
    return true
  }
  
  try{
    const response = await fetchWithAuth("http://localhost:3000/api/cart", {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(newItems)
    })

    if(!response.ok){
        const errorData = await response.json()
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
    const response = await fetchWithAuth("http://localhost:3000/api/cart/delete_all", {
      method:"DELETE",
      headers:{"Content-Type": "application/json"},
    })

    if(!response.ok){
        const errorData = await response.json()
        console.error(Error(errorData.error || "Failed to delete all cart items"))
        return false
      }

    return true
  }catch(error){
    console.error("Error during all cart items deleting :\n")
    return false
  }
}

export async function updateCartItems(updatedItems: CartItem[]): Promise<CartItemUpdateResult[]> {
  try {
    const updatePromises = updatedItems.map(async (item) => {
      try {
        const response = await fetchWithAuth("http://localhost:3000/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: item.id, product_num: item.num }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          return {
            product_id: item.id,
            success: false,
            message: errorData.error || `HTTP error! status: ${response.status}`,
          }
        }

        const successData = await response.json()
        return {
          product_id: item.id,
          success: successData.success || true,
          message: successData.message || 'Updated successfully',
        }
      } catch (err) {
        console.error(`Network or parsing error for item ${item.id}:`, err)
        return {
          product_id: item.id,
          success: false,
          message: (err as Error).message || 'Network error',
        }
      }
    })

    const allResults = await Promise.allSettled(updatePromises)

    const processedResults: CartItemUpdateResult[] = allResults.map((result, index) => {
      const originalItem = updatedItems[index]
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.error(`Item (${originalItem.id}) ${originalItem.title} update failed unexpectedly:`, result.reason)
        return {
          product_id: originalItem.id,
          success: false,
          message: (result.reason as Error).message || 'Unknown network error',
        }
      }
    })

    return processedResults
  } catch (error) {
    console.error("Critical error during Promise.allSettled processing:", error)
    return updatedItems.map(item => ({
      product_id: item.id,
      success: false,
      message: (error as Error).message || 'Global failure',
    }))
  }
}
import api from "./api"
import type { Phone } from "../types/Phone"


// 1. LẤY DANH SÁCH SẢN PHẨM (Giữ lại logic map để tránh lỗi dữ liệu trống)
export const getPhones = async (): Promise<Phone[]> => {
  try {
    const res = await api.get("/products")

    if (!Array.isArray(res.data)) return []

    return res.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img?.startsWith("http")
      ? item.img
      : `http://localhost:3000${item.img}`,
      rating: item.rating || 0,
      description: item.description || ""
    }))
  } catch (error) {
    console.error("API lỗi:", error)
    return []
  }
}

// 2. THÊM SẢN PHẨM MỚI
export const addPhone = async (data: FormData) => {
  return await api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

// 3. XÓA SẢN PHẨM
export const deletePhone = async (id: number) => {
  return await api.delete(`/products/${id}`)
}

// 4. CẬP NHẬT SẢN PHẨM
export const updatePhone = async (id: number, data: FormData) => {
  return await api.put(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
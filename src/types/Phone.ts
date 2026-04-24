export interface Phone {
  id: number
  name: string
  price: number
  img: string
  rating: number
  description?: string
  images?: string[]
  video?: string
}

export type CartItem = Phone & {
  qty: number
}
export interface Order {
  id: number
  customer: {
    name: string
    phone: string
    address: string
    email: string
  }
  items: any[]
  total: number
}
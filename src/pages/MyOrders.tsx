import { useEffect, useState } from "react"

function MyOrders() {
  const [orders, setOrders] = useState<any[]>([])

  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]")

    const myOrders = data.filter(
      (o: any) => o.userId === currentUser?.id
    )

    setOrders(myOrders)
  }, [])

  const formatVND = (amount: number) =>
    (amount * 25000).toLocaleString("vi-VN") + " ₫"

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const res = await fetch(`http://localhost:3000/api/orders/user/${user.id}`)
    const data = await res.json()

    setOrders(data)
  }

  fetchOrders()
}, [])
  return (
    <div className="container">
      <h2>📦 Đơn hàng của bạn</h2>

      {orders.length === 0 && <p>Chưa có đơn hàng nào</p>}

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h4>🆔 {order.id}</h4>

          <div className="order-items">
            {order.items.map((item: any) => (
              <div key={item.id} className="item">
                {item.name} x{item.qty}
              </div>
            ))}
          </div>

          <p>💳 {order.payment}</p>

          <h3 className="price">
            {formatVND(order.total)}
          </h3>

          <span className={`status ${order.status}`}>
            {order.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default MyOrders
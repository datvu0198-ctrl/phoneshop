import type { CartItem } from "../types/Phone"
import { useState, useEffect } from "react"
import { validateForm } from "../utils/validation"
import { useNavigate } from "react-router-dom"
import Payment from './Payment';

type Props = {
  cart: CartItem[]
  removeItem: (id: number) => void
  changeQty: (id: number, qty: number) => void
  total: number
  closeCart: () => void
  clearCart: () => void
}

function Cart({ cart, removeItem, changeQty, total, closeCart, clearCart }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" })
  const [errors, setErrors] = useState<any>({})
  const [success, setSuccess] = useState(false)
  const [payment, setPayment] = useState("cod")
  const [tab, setTab] = useState<"cart" | "orders" | "user">("cart")
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => {
  const fetchOrders = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null")
    if (!currentUser) return

    const res = await fetch(`http://localhost:3000/api/orders/user/${currentUser.id}`)
    const data = await res.json()

    setOrders(data)
  }

  fetchOrders()
  }, [success]) 
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
        closeCart()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, closeCart])

  const formatVND = (price: number) =>
    (price * 25000).toLocaleString("vi-VN") + " ₫"

  // Hàm xử lý hiển thị ảnh an toàn
  const getImgUrl = (imgStr: string) => {
    if (!imgStr) return "https://via.placeholder.com/150?text=No+Image";
    if (imgStr.startsWith('http')) return imgStr;
    // Xử lý nếu imgStr bắt đầu bằng dấu / thì không cộng thêm /
    const path = imgStr.startsWith('/') ? imgStr : `/${imgStr}`;
    return `http://localhost:3000${path}`;
  }

const handleCheckout = async () => {
    // 1. Kiểm tra giỏ hàng
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    // 2. Validate form thông tin giao hàng
    const validateErrors = validateForm(form);
    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors);
      return;
    }

    // 3. Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!currentUser) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    try {
      // 4. Gửi dữ liệu lên Server API
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          total: total,
          payment_method: payment, // Thêm phương thức thanh toán từ state
          customer_info: form,     // Gửi kèm thông tin người nhận
          items: cart.map(item => ({
            id: item.id,
            quantity: item.qty,   // Map qty từ frontend sang quantity cho backend
            price: item.price
          }))
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng trên server");
      }

      // 5. Xử lý sau khi thành công
      clearCart();
      setSuccess(true);
      setErrors({});
      setForm({ name: "", phone: "", address: "", email: "" });

    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  return (
    <div className="cart-box">
      <div className="cart-header">
        <h2>🛒 Giỏ hàng</h2>
        <button className="close-cart" onClick={closeCart}>✖</button>
      </div>

      <div className="cart-tabs">
        <button className={`tab-btn ${tab === "cart" ? "active" : ""}`} onClick={() => setTab("cart")}>
          <span>🛒</span> <p>Giỏ hàng</p>
        </button>
        <button className={`tab-btn ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          <span>📦</span> <p>Đơn hàng</p>
        </button>
        <button className={`tab-btn ${tab === "user" ? "active" : ""}`} onClick={() => setTab("user")}>
          <span>👤</span> <p>Tài khoản</p>
        </button>
      </div>

      {tab === "cart" && (
        <>
          {cart.length === 0 ? (
            <p className="empty">Giỏ hàng trống</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={getImgUrl(item.img)} 
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                />
                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-price">{formatVND(item.price)}</p>
                  <div className="qty-box">
                    <button className="qty-btn" onClick={() => changeQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                    <span>{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="right">
                  <p>{formatVND(item.price * item.qty)}</p>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              </div>
            ))
          )}

          <div className="cart-total">
            <h3>Tổng: {formatVND(total)}</h3>
            <div className="checkout-form">
              <h4>Thông tin</h4>
              <input placeholder="Tên" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="error">{errors.name}</p>}
              <input placeholder="SĐT" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              {errors.phone && <p className="error">{errors.phone}</p>}
              <input placeholder="Địa chỉ" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              {errors.address && <p className="error">{errors.address}</p>}
              <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="error">{errors.email}</p>}
              <Payment payment={payment} setPayment={setPayment} />
              <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>📦 Xác nhận mua</button>
            </div>
          </div>
        </>
      )}

      {tab === "orders" && (
  <div>
    <h3>📦 Đơn hàng của bạn</h3>
    {orders.length === 0 ? (
      <p className="empty">Chưa có đơn hàng nào</p>
    ) : (
      orders.map((order: any) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span className="order-id">#ORD-{order.id}</span>
            <span className={`status ${order.status || "pending"}`}>
              {order.status === "pending" || !order.status ? "⏳ Đang xử lý" : 
               order.status === "confirmed" ? "✅ Đã xác nhận" : "❌ Đã hủy"}
            </span>
          </div>

          <div className="order-items">
            {/* Kiểm tra items có tồn tại không và map qua */}
            {order.items?.map((orderItem: any) => (
              <div key={orderItem.id} className="order-item">
                {/* Nếu backend có trả về thông tin sản phẩm (name, img) thì hiển thị, 
                    nếu không thì hiển thị ID sản phẩm */}
                <div key={orderItem.id} className="order-item">
                <img
                  src={getImgUrl(orderItem.img)}
                  alt={orderItem.name}
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                />

                <div className="order-item-info">
                  <p className="name">{orderItem.name}</p>
                  <p>Số lượng: x{orderItem.quantity}</p>
                  <p>Giá: {formatVND(orderItem.price)}</p>
                </div>
              </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="order-summary">
              <span>Phương thức: {order.payment_method?.toUpperCase()}</span>
              <p>Tổng cộng: <b>{formatVND(order.total)}</b></p>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}

  {/* ================= TAB USER ================= */}
  {tab === "user" && (
  <div className="cart-user-box">
    <h3 style={{color:"#38bdf8"}}>👤 Tài khoản</h3>

    {!currentUser ? (
      <p>Bạn chưa đăng nhập</p>
    ) : (
      <>
        <div className="user-header">
          <div>
            <h4>{currentUser.username}</h4>
            <p>{currentUser.email}</p>
          </div>
        </div>

        <div className="user-info">
          <p>📱 {currentUser.phone || "Chưa cập nhật"}</p>
          <p>🏠 {currentUser.address || "Chưa cập nhật"}</p>
        </div>

        <div className="user-actions">
          <button onClick={() => setTab("orders")}>
            📦 Đơn hàng của tôi
          </button>

          {currentUser?.role === "admin" && (
          <button onClick={() => navigate("/admin")}>
            ⚙️ Trang quản lý
          </button>
          )}

          <button onClick={() => navigate("/profile")}>
            ✏️ Chỉnh sửa
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("user")
              window.location.reload()
            }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </>
    )}
  </div>
)}

  {/* SUCCESS POPUP */}
  {success && (
    <div className="payment-success">
      <div className="box">
        <h2>🎉 Thành công</h2>
        <p>Đơn hàng đã được tạo</p>

        <button
          onClick={() => {
            setSuccess(false)
            setTab("orders") // 🔥 chuyển tab luôn
          }}
        >
          Xem đơn hàng
        </button>
      </div>
    </div>
  )}
</div>
  )
}

export default Cart
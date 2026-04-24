import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { getPhones } from "./services/productService"
import Profile from "./pages/Profile"
import About from "./pages/About"
import ProductDetail from "./pages/ProductDetail"
import Shop from "./pages/Shop"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import AdminOrders from "./pages/admin/AdminOrders"
import MyOrders from "./pages/MyOrders"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import Forgot from "./pages/Forgot"
import ChatBot from "./components/ChatBot";
import type { Phone, CartItem } from "./types/Phone"
import "./index.css"
import AOS from "aos"
import "aos/dist/aos.css"
import "./styles/components/card.css"
function App() {
  const [, setShowCart] = useState(false)
  const closeCart = () => setShowCart(false)

  // 🔥 DATA
  const [apiPhones, setApiPhones] = useState<Phone[]>([])
  const [localPhones, setLocalPhones] = useState<Phone[]>(() => {
    const saved = localStorage.getItem("phones")
    return saved ? JSON.parse(saved) : []
  })

  const phones = [...localPhones, ...apiPhones].filter(
    (phone, index, self) =>
      index === self.findIndex(p => p.id === phone.id)
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem("phones", JSON.stringify(localPhones))
  }, [localPhones])

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true)
        const data = await getPhones()
        setApiPhones(data)
      } catch {
        setError("Không tải được dữ liệu từ API")
      } finally {
        setLoading(false)
      }
    }
    fetchPhones()
  }, [])

  // 🔥 CART
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (phone: Phone) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === phone.id)
      if (exist) {
        return prev.map(item =>
          item.id === phone.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { ...phone, qty: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const changeQty = (id: number, qty: number) => {
    if (qty < 1) return
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  // 🔥 ADMIN CRUD
  const addProduct = (newPhone: Phone) => {
    setLocalPhones(prev => [
      { ...newPhone, id: Date.now() + Math.random() },
      ...prev
    ])
  }

  const deleteProduct = (id: number) => {
    setLocalPhones(prev => prev.filter(p => p.id !== id))
  }

  const updateProduct = (updatedPhone: Phone) => {
    setLocalPhones(prev =>
      prev.map(p =>
        p.id === updatedPhone.id ? updatedPhone : p
      )
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>{error}</h2>
      </div>
    )
  }

  return (
  <>
    <Routes>

      {/* SHOP */}
      <Route
        path="/"
        element={
          <Shop
            phones={phones}
            loading={loading}
            addToCart={addToCart}
            cart={cart}
            removeItem={removeItem}
            changeQty={changeQty}
            total={total}
            clearCart={clearCart}
            closeCart={closeCart}
          />
        }
      />

      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />

      <Route
        path="/product/:id"
        element={
          <ProductDetail
            phones={phones}
            addToCart={addToCart}
          />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />

      <Route
        path="/admin"
        element={
          <Admin
            phones={phones}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />
        }
      />

      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/orders" element={<MyOrders />} />

      <Route path="*" element={<NotFound />} />

    </Routes>

    {/* 👉 chatbot luôn nằm ngoài */}
    <ChatBot addToCart={addToCart} phones={phones} />

  </>
)
}

export default App
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Product from "../components/Product"
import Cart from "../components/Cart"
import type { Phone, CartItem } from "../types/Phone"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { useEffect, useRef } from "react"
import ReviewSection from "../components/ReviewSection";
import Footer from "../components/Footer"
import { FaMobileAlt } from "react-icons/fa";
interface Props {
  phones: Phone[]
  loading: boolean
  addToCart: (phone: Phone) => void
  cart: CartItem[]
  removeItem: (id: number) => void
  changeQty: (id: number, qty: number) => void
  total: number
  clearCart: () => void
  closeCart: () => void
}

function Shop({
  phones,
  loading,
  addToCart,
  cart,
  removeItem,
  changeQty,
  total,
  clearCart
}: Props) {

  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [category, setCategory] = useState("all")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  const handleClickOutside = (e: any) => {
    if (!menuRef.current) return
    if (!menuRef.current.contains(e.target)) {
      setShowMenu(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])
  // --------------------
useEffect(() => {
  const handleScroll = () => {
    const nav = document.querySelector(".navbar")
    if (!nav) return

    if (window.scrollY > 50) {
      nav.classList.add("scrolled")
    } else {
      nav.classList.remove("scrolled")
    }
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

  // 🔐 Lấy user
  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  const filteredPhones = phones.filter(phone => {
  const matchSearch = phone.name.toLowerCase().includes(search.toLowerCase())

  if (category === "all") return matchSearch
  if (category === "iphone") return matchSearch && phone.name.toLowerCase().includes("iphone")
  if (category === "oppo") return matchSearch && phone.name.toLowerCase().includes("oppo")
  if (category === "realme") return matchSearch && phone.name.toLowerCase().includes("realme")
  if (category === "samsung")return matchSearch && phone.name.toLowerCase().includes("samsung")
  return matchSearch
})

  if (loading) {
    return (
      <div className="container center">
        <h3>Đang tải dữ liệu...</h3>
      </div>
    )
  }


  return (
    <>
        <div className="container">

            {/* ===== NAVBAR ===== */}
          <div className="navbar">
 {/* LEFT */}
<div className="logo" onClick={() => navigate("/")} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <FaMobileAlt size={26} className="logo-icon" />
  <span className="logo-text">PhoneShop</span>
</div>

  {/* CENTER */}
  <div className="nav-center">
    <button
      className="about-btn"
      onClick={() => navigate("/about")}
    >
      Giới thiệu
    </button>
  </div>

  {/* RIGHT */}
  <div className="nav-right">

    {/* SEARCH */}
    <input
      className="search"
      name="search"
      placeholder="🔍 Tìm điện thoại..."
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* CART */}
    <button
      className="cart-btn"
      onClick={() => setShowCart(!showCart)}
    >
      🛒
      {cart.length > 0 && (
        <span className="cart-badge">
          {cart.reduce((sum, item) => sum + item.qty, 0)}
        </span>
      )}
    </button>

    {/* USER */}
{currentUser ? (
  <div className="user-box" ref={menuRef}>
    <span
      className="user-name"
      onClick={(e) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
      }}
    >
      👋 {currentUser.username}
    </span>

    {showMenu && (
      <div className={`dropdown-menu ${showMenu ? "active" : ""}`}>
        <div onClick={() => navigate("/orders")}>
          📦 Đơn hàng
        </div>

        {currentUser.role === "admin" && (
          <div onClick={() => navigate("/admin/orders")}>
            🛠 Quản lý đơn
          </div>
        )}

        <div
          onClick={() => {
            localStorage.removeItem("user")
            navigate("/")
            window.location.reload() // 🔥 QUAN TRỌNG
          }}
        >
          🚪 Đăng xuất
        </div>
      </div>
    )}
  </div>
) : (
  <div className="nav-actions">
    <button
      className="btn-nav login-btn"
      onClick={() => navigate("/login")}
    >
      Đăng nhập
    </button>

    <button
      className="btn-nav register-btn"
      onClick={() => navigate("/register")}
    >
      Đăng ký
    </button>
  </div>
)}
  </div>
</div>

        {/* ===== CART ===== */}
        {showCart && (
          <>
            <div className="cart-overlay" onClick={() => setShowCart(false)} />
          <Cart
            cart={cart}
            removeItem={removeItem}
            changeQty={changeQty}
            total={total}
            closeCart={() => setShowCart(false)}
            clearCart={clearCart}
          />
          </>
        )}

        {/* ===== BANNER ===== */}
        <div className="banner" data-aos="zoom-in">
          <img
            src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1400"
            alt="Banner"
            style={{
              width: "100%",
              height: "600px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
        </div>
          
        {/* ===== SLIDER ===== */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h3 className="section-title">Sản phẩm mới</h3>
        </div>

        <div className="new-products">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              1024: { slidesPerView: 4 }
            }}
            >
          {filteredPhones.map(phone => (
            <SwiperSlide key={phone.id}>
              <Product
                phone={phone}
                addToCart={addToCart}
                onView={() => navigate(`/product/${phone.id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      

        {/* ===== REVIEW ===== */}
        <ReviewSection />

        {/* ===== GRID ===== */}
        <div className="featured">
          <h3 className="section-title">Sản phẩm nổi bật</h3>
         <div className="categories">
  <div
    className={`category ${category === "all" ? "active" : ""}`}
    onClick={() => setCategory("all")}
  >
    📊 Tất cả
  </div>

  <div
    className={`category ${category === "iphone" ? "active" : ""}`}
    onClick={() => setCategory("iphone")}
  >
    📱 iPhone
  </div>

  <div
    className={`category ${category === "samsung" ? "active" : ""}`}
    onClick={() => setCategory("samsung")}
  >
    📱 Samsung
  </div>

  <div
    className={`category ${category === "realme" ? "active" : ""}`}
    onClick={() => setCategory("realme")}
  >
    📱 Realme
  </div>
</div>
          <div className="product-grid">
            {filteredPhones.slice(0, 8).map((phone, index) => (
              <div
                key={phone.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Product
                  phone={phone}
                  addToCart={addToCart}
                  onView={() => navigate(`/product/${phone.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </>
  )
}

export default Shop
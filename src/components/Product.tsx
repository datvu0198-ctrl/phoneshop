import type { Phone } from "../types/Phone"
import { useState } from "react"

type Props = {
  phone: Phone
  addToCart: (phone: Phone) => void
  onView: () => void
}

function Product({ phone, addToCart, onView }: Props) {

  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    // 🚫 chặn admin
    if (user?.role === "admin") {
      alert("Admin không thể mua hàng")
      return
    }

    // ✅ thêm vào giỏ
    addToCart(phone)

    // 👉 hiệu ứng UI
    const cartBtn = document.querySelector(".cart-btn") as HTMLElement
    cartBtn?.click()

    setAdded(true)
    setTimeout(() => setAdded(false), 400)

    // ✨ animation bay vào giỏ
    const img = e.currentTarget.closest(".product-card")?.querySelector("img")
    const cart = document.querySelector(".cart-btn")

    if (img && cart) {
      const imgRect = img.getBoundingClientRect()
      const cartRect = cart.getBoundingClientRect()

      const clone = img.cloneNode(true) as HTMLImageElement

      clone.style.position = "fixed"
      clone.style.left = imgRect.left + "px"
      clone.style.top = imgRect.top + "px"
      clone.style.width = imgRect.width + "px"
      clone.style.height = imgRect.height + "px"
      clone.style.borderRadius = "10px"
      clone.style.zIndex = "9999"
      clone.style.transition = "all 0.8s cubic-bezier(.4,-0.3,1,.68)"

      document.body.appendChild(clone)

      requestAnimationFrame(() => {
        clone.style.left = cartRect.left + "px"
        clone.style.top = cartRect.top + "px"
        clone.style.width = "30px"
        clone.style.height = "30px"
        clone.style.opacity = "0.3"
        clone.style.transform = "rotate(360deg)"
      })

      setTimeout(() => clone.remove(), 800)
    }
  }

  const formatVND = (price: number) => {
    return (price * 25000).toLocaleString("vi-VN") + " ₫"
  }

  const imgSrc =
    phone.img?.startsWith("http")
      ? phone.img
      : phone.img
      ? `http://localhost:3000${phone.img}`
      : "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"

  return (
    <div className="product-card fade-up">

      <div
        className={`heart ${liked ? "active" : ""}`}
        onClick={() => setLiked(!liked)}
      >
        {liked ? "❤️" : "🤍"}
      </div>

      <div className="img-wrap">
        <img
          src={imgSrc}
          alt={phone.name}
          loading="lazy"
          onClick={onView}
          onError={(e) => {
            e.currentTarget.src =
              "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"
          }}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "contain",
            padding: "10px",
            cursor: "pointer"
          }}
        />
      </div>

      <h3 className="phone-name">{phone.name}</h3>
      <p className="price">{formatVND(phone.price)}</p>
      <div className="rating">⭐ {phone.rating.toFixed(1)}</div>

      <div className="btn-group">
        <button
          className={`btn buy-btn ${added ? "added" : ""}`}
          onClick={(e) => handleAdd(e)}
        >
          🛒 Mua
        </button>

        <button className="btn info-btn" onClick={onView}>
          ℹ Chi tiết
        </button>
      </div>
    </div>
  )
}

export default Product
import { useParams, useNavigate } from "react-router-dom"
import type { Phone } from "../types/Phone"
import { useState, useEffect } from "react"

type Props = {
  phones: Phone[]
  addToCart: (phone: Phone) => void
}

function ProductDetail({ addToCart }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [phone, setPhone] = useState<Phone | null>(null)
  const [activeMedia, setActiveMedia] = useState<{ type: "image" | "video", src: string }>({ type: "image", src: "" })
  const [showVideo, setShowVideo] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setPhone(data))
  }, [id])

  // ================= HELPER =================
  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ""
  }

  const getImageUrl = (img: string) =>
    img?.startsWith("http") ? img : `http://localhost:3000${img}`

  const formatVND = (price: number) =>
    (price * 25000).toLocaleString("vi-VN") + " ₫"

  // ================= IMAGES =================
  const parseImages = (): string[] => {
  try {
    if (!phone) return []

    let extra: string[] = []

    if (typeof phone.images === "string") {
      extra = JSON.parse((phone.images as string).replace(/'/g, '"'))
    } else if (Array.isArray(phone.images)) {
      extra = phone.images
    }

    return [phone.img, ...extra]
      .filter(Boolean)
      .map((img) => getImageUrl(img as string))
  } catch {
    return []
  }
}

  const images = parseImages()

  // ================= INIT MEDIA =================
  useEffect(() => {
    if (phone?.img) {
      setActiveMedia({
        type: "image",
        src: getImageUrl(phone.img)
      })
      fetchComments()
    }
  }, [phone])

  // ================= COMMENTS =================
  const fetchComments = async () => {
    const res = await fetch(`http://localhost:3000/api/comments/${phone?.id}`)
    if (res.ok) setComments(await res.json())
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: phone?.id,
        rating: newRating,
        content: newComment,
        user: "Khách hàng"
      })
    })

    setNewComment("")
    fetchComments()
  }

  // ================= ACTION =================
  const handleAddToCart = () => {
    if (!phone) return
    addToCart(phone)
    navigate("/")
  }

  if (!phone) return <h2 className="text-center mt-5">Không tìm thấy sản phẩm</h2>

  // ================= RENDER =================
  return (
    <div className="container mt-5 product-detail">
      <button
  className="btn btn-outline-light mb-3 back-home-btn"
  onClick={() => navigate("/")}
>
  ← Quay về trang chủ
</button>
      <div className="row g-4">

        {/* LEFT */}
<div className="col-lg-6">
  
  <div className="fpt-card">
    {/* INFO LEFT */}
<div className="fpt-info mt-3">
  <h2 className="text-white">{phone.name}</h2>

  <div className="text-light text-decoration-line-through">
    {(phone.price * 27000).toLocaleString()} ₫
  </div>

  <h3 className="price">{formatVND(phone.price)}</h3>
  <div className="discount-badge">
  -{Math.round(100 - (phone.price * 25000) / (phone.price * 27000) * 100)}%
  </div>
<div className="stock">✅ Còn hàng</div>
  <button
    className="btn btn-primary w-100 mt-3"
    onClick={handleAddToCart}
  >
    Thêm vào giỏ
  </button>
  <button className="btn btn-warning w-100 mt-2">
  Mua ngay
</button>
</div>

    {/* MAIN MEDIA */}
    <div
      className="fpt-main"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        e.currentTarget.style.setProperty("--x", `${x}%`)
        e.currentTarget.style.setProperty("--y", `${y}%`)
      }}
    >
      {activeMedia.type === "image" ? (
        <img src={activeMedia.src} className="fpt-img" />
      ) : (
        <iframe src={activeMedia.src} className="fpt-video" />
      )}

      {/* PLAY */}
      {phone.video && activeMedia.type === "image" && (
        <div className="fpt-play" onClick={() => setShowVideo(true)}>
          ▶
        </div>
      )}
    </div>

    {/* THUMB SLIDER */}
    <div className="fpt-thumb-slider">

      {phone.video && (
        <div
          className={`fpt-thumb video ${
            activeMedia.type === "video" ? "active" : ""
          }`}
          onClick={() =>
            setActiveMedia({
              type: "video",
              src: getYoutubeEmbed(phone.video!)
            })
          }
        >
          ▶
        </div>
      )}

      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`fpt-thumb ${
            activeMedia.src === img ? "active" : ""
          }`}
          onClick={() => setActiveMedia({ type: "image", src: img })}
        />
      ))}
    </div>
      
  </div>
</div>

        {/* RIGHT */}
  <div className="col-lg-6">
  <div className="right-scroll">

    {/* DESCRIPTION */}
    <div className="fpt-right-card mb-4">
      <h4>Mô tả</h4>
      <div className="desc">
        {(phone.description || "").split("\n").map((line, i) => {
          if (line.startsWith("-")) {
            return <li key={i}>{line.replace("-", "").trim()}</li>
          }

          if (
            line.toLowerCase().includes("đánh giá") ||
            line.toLowerCase().includes("kết luận")
          ) {
            return <h5 key={i} className="desc-title">{line}</h5>
          }

          return (
            <p key={i}>
              {line.split(/(Snapdragon|RAM|Pin|Android|GPU)/g).map((part, idx) =>
                ["Snapdragon", "RAM", "Pin", "Android", "GPU"].includes(part) ? (
                  <b key={idx}>{part}</b>
                ) : (
                  part
                )
              )}
            </p>
          )
        })}
      </div>
    </div>

    {/* COMMENTS */}
    <div className="fpt-right-card">
      <h4>Đánh giá</h4>

      <div className="mb-2 text-warning d-flex align-items-center gap-2">
        <span style={{ fontSize: "18px" }}>⭐</span>
        <b>
          {comments.length
            ? (comments.reduce((a, c) => a + c.rating, 0) / comments.length).toFixed(1)
            : 5}
        </b>
        <span>/ 5 ({comments.length} đánh giá)</span>
      </div>

      <div className="mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <i
            key={i}
            className={`bi ${i <= newRating ? "bi-star-fill text-warning" : "bi-star"}`}
            onClick={() => setNewRating(i)}
          />
        ))}
      </div>

      <textarea
        className="form-control mb-2"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />

      <button className="btn btn-dark w-100" onClick={handleAddComment}>
        Gửi
      </button>

      <div className="mt-3">
        {comments.map(c => (
          <div key={c.id} className="border-bottom py-2">
            <b>{c.user}</b>
            <p className="mb-0">{c.content}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="modal-custom" onClick={() => setShowVideo(false)}>
          <iframe src={getYoutubeEmbed(phone.video!)} />
        </div>
      )}

      {/* GALLERY */}
      {showGallery && (
        <div className="modal-custom" onClick={() => setShowGallery(false)}>
          <img src={activeMedia.src} />
        </div>
      )}

    </div>
  )
}

export default ProductDetail
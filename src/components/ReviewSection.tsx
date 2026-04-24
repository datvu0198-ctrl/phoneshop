import { useRef, useState } from "react"
import "./review.css"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

// 1. Cập nhật mảng dữ liệu với đầy đủ thông tin sản phẩm
const videos = [
  {
    id: 1,
    src: "/videos/review1.mp4",
    name: "Iphone 14 PRO",
    price: "20.000.000đ",
    image: "/images/p1.png"
  },
  {
    id: 2,
    src: "/videos/review2.mp4",
    name: "Samsung Galaxy S26",
    price: "33.490.000đ",
    image: "/images/p2.png"
  },
  {
    id: 3,
    src: "/videos/review3.mp4",
    name: "Realme 11 Pro",
    price: "3.650.000đ",
    image: "/images/p3.png"
  },
  {
    id: 4,
    src: "/videos/review4.mp4",
    name: "Realme C55",
    price: "3.480.000đ",
    image: "/images/p4.png"
  }
]

function ReviewSection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handlePlay = (id: number, index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingId === id) {
      video.pause()
      setPlayingId(null)
    } else {
      video.play()
      setPlayingId(id)
    }
  }

  return (
    <div className="review-section">
      <h2 className="review-title">🎥 Góc review dành cho bạn</h2>

      {/* ===== SWIPER ===== */}
      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          600: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id}>
            {/* 2. Thay thế nội dung review-card cũ bằng cấu trúc mới có INFO */}
            <div
              className="review-card"
              onClick={() => setSelectedVideo(video.src)}
            >
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={video.src}
                className="review-video"
                muted
                loop // Thêm loop nếu bạn muốn video tự lặp lại
              />

              <div className="play-overlay">▶</div>

              {/* PHẦN INFO MỚI THÊM VÀO */}
              <div className="review-info">
                <img src={video.image} alt={video.name} />
                <div>
                  <p className="review-name">{video.name}</p>
                  <p className="review-price">{video.price}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ===== POPUP (Giữ nguyên) ===== */}
      {selectedVideo && (
        <div
          className="video-modal"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="modal-video"
            />
            <button
              className="close-btn"
              onClick={() => setSelectedVideo(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewSection
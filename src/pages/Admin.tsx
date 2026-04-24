import { useEffect, useState } from "react"
import type { Phone } from "../types/Phone"
import { useNavigate } from "react-router-dom"
import "../index.css"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts"
import AdminOrders from "./admin/AdminOrders"; // Đã import component đơn hàng

import {
  addPhone,
  deletePhone,
  updatePhone
} from "../services/productService"

type Props = {
  phones: Phone[];
  addProduct?: (newPhone: any) => void;
  deleteProduct?: (id: number) => void;
  updateProduct?: (updatedPhone: any) => void;
}

function Admin({ phones }: Props) {
  const navigate = useNavigate()

  // 🔐 Check quyền Admin
  useEffect(() => {
    const role = localStorage.getItem("userRole")
    if (role !== "admin") {
      navigate("/")
    }
  }, [navigate])

  // 🔥 STATE
  const [tab, setTab] = useState<"products" | "orders">("products") // Tab điều hướng
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [images, setImages] = useState<FileList | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  // 📦 Xử lý dữ liệu Đơn hàng & Doanh thu
  const orders = JSON.parse(localStorage.getItem("orders") || "[]")

  const revenueByDate: any = {}
  orders.forEach((o: any) => {
    const date = new Date(o.id).toLocaleDateString("vi-VN")
    if (!revenueByDate[date]) revenueByDate[date] = 0
    revenueByDate[date] += (o.total * 25000)
  })

  const chartData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  }))

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0)
  const totalOrders = orders.length
  const totalProducts = phones.length
  const avgPrice = phones.reduce((sum, p) => sum + p.price, 0) / (phones.length || 1)

  const filteredPhones = phones.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount * 25000)

  const resetForm = () => {

  setName("")

  setPrice("")

  setImages(null)

  setVideo(null)

  setDescription("")

  setRating("")

  setEditingId(null)

}

  const submit = async () => {
    if (!name || !price || (!images && !editingId)) {
      alert("Vui lòng nhập đủ thông tin")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("rating", rating || "0")
    formData.append("description", description)

        // upload nhiều ảnh
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i])
      }
    }

    // upload video
    if (video) {
      formData.append("video", video)
    }

    try {
      if (editingId) {
        await updatePhone(editingId, formData)
        alert("Cập nhật thành công!")
      } else {
        await addPhone(formData)
        alert("Thêm sản phẩm thành công!")
      }
      resetForm()
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("Lỗi API!")
    }
  }

  const editProduct = (phone: Phone) => {
    setTab("products") // Chuyển về tab sản phẩm nếu đang ở tab đơn hàng
    setEditingId(phone.id)
    setName(phone.name)
    setPrice(phone.price.toString())
    setRating(phone.rating.toString())
    setImages(null)
    setVideo(null)
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

 return (
  <div className="admin-container">

    {/* HEADER */}
    <div className="admin-header glass">
      <h2>⚙️ Admin Dashboard</h2>

      <div className="admin-actions">
        <button className="btn ghost" onClick={() => navigate("/")}>
          🏠 Trang chủ
        </button>

        <button
          className="btn danger"
          onClick={() => {
            localStorage.removeItem("user")
            localStorage.removeItem("userRole")
            localStorage.removeItem("username")
            navigate("/login")
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>

    {/* DASHBOARD */}
<div className="dashboard">
  {/* Thêm glass trực tiếp vào từng card như thế này */}
  <div className="admin-card glass">
    <h4>💰 Doanh thu</h4>
    <p className="value success">{formatVND(totalRevenue)}</p>
  </div>

  <div className="admin-card glass" onClick={() => setTab("orders")}>
    <h4>📦 Đơn hàng</h4>
    <p className="value primary">{totalOrders}</p>
  </div>

  <div className="admin-card glass" onClick={() => setTab("products")}>
    <h4>📱 Sản phẩm</h4>
    <p className="value info">{totalProducts}</p>
  </div>

  <div className="admin-card glass">
    <h4>📊 Giá TB</h4>
    <p className="value">{formatVND(avgPrice)}</p>
  </div>
</div>

    {/* CHART */}
    <div className="glass chart-box">
      <h4>📈 Doanh thu</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* TAB */}
    <div className="admin-tabs">
      <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
        📱 Sản phẩm
      </button>

      <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
        📦 Đơn hàng
      </button>
    </div>

    {/* CONTENT */}
    {tab === "products" ? (
      <>
        {/* FORM */}
        <div className="glass form-box">
          <h4>{editingId ? "📝 Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h4>

          <div className="form-grid">
            <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Giá" value={price} onChange={e => setPrice(e.target.value)} />
            <input type="number" placeholder="Rating" value={rating} onChange={e => setRating(e.target.value)} />
            {/* nhiều ảnh */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
            />

            {/* video */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />

            {/* mô tả */}
            <textarea
              placeholder="Mô tả sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn primary" onClick={submit}>
              {editingId ? "Cập nhật" : "Thêm"}
            </button>

            {editingId && (
              <button className="btn ghost" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="glass table-box">
          <div className="table-header">
            <h4>Danh sách sản phẩm</h4>
            <input placeholder="🔍 Tìm..." onChange={(e) => setSearch(e.target.value)} />
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
            {filteredPhones.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>

                {/* ✅ THÊM ẢNH */}
                <td>
                  <img
                    src={
                      p.img
                        ? p.img.startsWith("http")
                          ? p.img
                          : `http://localhost:3000/${p.img.replace(/^\/+/, "")}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={p.name}
                    className="table-img"
                  />
                </td>

                <td>{p.name}</td>
                <td>{formatVND(p.price)}</td>

                <td className="actions">
                  <button className="edit" onClick={() => editProduct(p)}>✏️</button>
                  <button
                    className="delete"
                    onClick={async () => {
                      if (confirm("Xóa?")) {
                        await deletePhone(p.id)
                        window.location.reload()
                      }
                    }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </>
    ) : (
      <AdminOrders />
    )}
  </div>
)
}

export default Admin
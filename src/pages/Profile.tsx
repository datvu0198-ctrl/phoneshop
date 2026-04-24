import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Profile() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("user") || "null")

  const [form, setForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  })

  const handleSave = () => {
    if (!form.username || !form.email) {
      alert("Vui lòng nhập đầy đủ thông tin")
      return
    }
    const updatedUser = { ...currentUser, ...form }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    alert("Cập nhật thành công!")
    navigate("/")
  }

  return (
    <div className="profile-container">
      <div className="profile-box fade-up">
        <h2>👤 Thông tin cá nhân</h2>
        
        <div className="profile-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              placeholder="Nhập họ tên..."
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email liên hệ</label>
            <input
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              placeholder="Nhập số điện thoại..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ nhận hàng</label>
            <input
              placeholder="Số nhà, tên đường..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave}>💾 Lưu thay đổi</button>
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
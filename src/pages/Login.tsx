
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      // ✅ lưu user
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("username", data.username);
      localStorage.setItem("userRole", data.role);

      // 🔀 chuyển trang
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert("Lỗi server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập hệ thống</h2>

        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group password-box">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <p
          className="forgot-link"
          onClick={() => navigate("/forgot")}
        >
          Quên mật khẩu?
        </p>

        <button onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          Chưa có tài khoản?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
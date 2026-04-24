import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/userService";
import { Eye, EyeOff } from "lucide-react"; 
import "./admin/Login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!username || !password || !email || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    if (password.length < 4) {
      setError("Mật khẩu phải >= 4 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      await register(username, password, email);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="login-container"> {/* Sử dụng class background gradient */}
      <div className="login-card"> {/* Sử dụng class hiệu ứng Glass card */}
        <h2>Đăng ký</h2>

        {error && <p className="error" style={{ marginBottom: '10px' }}>{error}</p>}

        {/* Ô Username */}
        <div className="form-group">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Ô Email */}
        <div className="form-group">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Ô Mật khẩu có Icon */}
        <div className="form-group password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {/* Ô Nhập lại mật khẩu */}
        <div className="form-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRegister}>
          Đăng ký
        </button>

        <p className="forgot-link" onClick={() => navigate("/forgot")}>
          Quên mật khẩu?
        </p>

        <p className="switch">
          Đã có tài khoản?{" "}
          <span onClick={() => navigate("/login")}>Đăng nhập</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
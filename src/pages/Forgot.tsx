import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/userService";

function Forgot() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");

  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const otpRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const navigate = useNavigate();

  // ================= OTP INPUT =================
  const handleChangeOTP = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, step]);

  // ================= GỬI OTP =================
  const handleSendOTP = async () => {
    try {
      if (!email) {
        alert("Nhập email");
        return;
      }

      setLoading(true);

      await forgotPassword(email);

      setLoading(false);
      setStep(2);
      setTimeLeft(60);

      alert("OTP đã gửi! Kiểm tra Mailtrap");

    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };

  // ================= RESEND =================
  const handleResend = async () => {
    try {
      if (timeLeft > 0) return;

      await forgotPassword(email);
      setTimeLeft(60);

      alert("Đã gửi lại OTP");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ================= RESET =================
  const handleReset = async () => {
    try {
      const otp = otpArray.join("");

      if (otp.length < 6) {
        alert("Nhập đủ OTP");
        return;
      }

      if (!newPass) {
        alert("Nhập mật khẩu mới");
        return;
      }

      await resetPassword(email, otp, newPass);

      alert("Đổi mật khẩu thành công!");
      navigate("/login");

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Quên mật khẩu</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="auth-btn" onClick={handleSendOTP}>
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* OTP BOX */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {otpArray.map((data, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  value={data}
                  onChange={(e) => handleChangeOTP(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  style={{
                    width: "40px",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                  }}
                />
              ))}
            </div>

            {/* TIMER */}
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              {timeLeft > 0
                ? `Gửi lại sau ${timeLeft}s`
                : "Bạn có thể gửi lại OTP"}
            </p>

            <button
              className="auth-btn"
              onClick={handleResend}
              disabled={timeLeft > 0}
              style={{ marginBottom: "10px" }}
            >
              Gửi lại OTP
            </button>

            <input
              type="password"
              placeholder="Mật khẩu mới"
              onChange={(e) => setNewPass(e.target.value)}
            />

            <button className="auth-btn" onClick={handleReset}>
              Đổi mật khẩu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Forgot;
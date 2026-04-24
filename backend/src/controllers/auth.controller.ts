import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/mail";

const SECRET = process.env.JWT_SECRET!;

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // check username
    const [existUser]: any = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existUser.length > 0) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // check email
    const [existEmail]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existEmail.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hashed, email, "customer"]
    );

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    console.log("JWT:", process.env.JWT_SECRET);

    const { username, password } = req.body;

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    console.log("USER:", rows);

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// ================= GENERATE OTP =================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log("📩 EMAIL NHẬN:", email); // debug

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("📊 USER QUERY:", rows); // debug

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const user = rows[0];

    const otp = "123456"; // test tạm
    const expire = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "UPDATE users SET otp = ?, otp_expire = ? WHERE id = ?",
      [otp, expire, user.id]
    );

    const isSent = await sendOTP(email, otp);

    console.log("📨 SEND OTP RESULT:", isSent); // debug

    if (!isSent) {
      return res.status(500).json({ message: "Gửi mail thất bại" });
    }

    res.json({ message: "Đã gửi OTP" });

  } catch (err) {
    console.error("🔥 LỖI THẬT:", err); // ⚠️ QUAN TRỌNG NHẤT
    res.status(500).json({ message: "Lỗi server" });
  }
};
// ================= RESET PASSWORD =================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "OTP không đúng" });
    }

    const user = rows[0];

    if (!user.otp_expire || new Date(user.otp_expire) < new Date()) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, otp = NULL, otp_expire = NULL WHERE id = ?",
      [hashed, user.id]
    );

    res.json({ message: "Đổi mật khẩu thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
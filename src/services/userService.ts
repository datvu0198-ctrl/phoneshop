import type { User } from "../types/user";

const API_URL = "http://localhost:3000/api/auth";

// ================= REGISTER =================
export const register = async (
  username: string,
  password: string,
  email: string
) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
};

// ================= LOGIN =================
export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Sai tài khoản hoặc mật khẩu");
  }

  // ✅ lưu token + user
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));

  return data;
};

// ================= GET CURRENT USER =================
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

// ================= LOGOUT =================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ================= OTP =================

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gửi OTP thất bại");
  }

  return data;
};

// ================= RESET PASSWORD =================
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Reset thất bại");
  }

  return data;
};
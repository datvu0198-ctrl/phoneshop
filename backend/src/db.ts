import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Nạp các biến môi trường từ file .env
dotenv.config();

// Sử dụng createPool để tối ưu hiệu suất kết nối
export const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  // Ép kiểu port sang Number và sử dụng cổng 3307 theo cấu hình XAMPP của bạn
  port: Number(process.env.DB_PORT) || 3307, 
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "shop_phone",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối ngay khi khởi động backend
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL connected (Port 3307)");
    connection.release(); // Trả lại kết nối vào pool sau khi kiểm tra xong
  } catch (err) {
    console.error("❌ DB error:", err);
  }
})();

export default db;
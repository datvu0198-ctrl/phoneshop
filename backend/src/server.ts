import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes"
import orderRoutes from "./routes/order.routes"
import commentRoutes from "./routes/comment.routes.js"

// 🔥 FIX LOAD .ENV CHUẨN 100%
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 luôn trỏ đúng backend/.env
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

// 👉 DEBUG (rất quan trọng)
console.log("🔑 OPENAI KEY:", process.env.OPENAI_API_KEY ? "OK" : "MISSING");

import chatRoutes from "./routes/chat.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 STATIC FILE (ảnh)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);
app.use("/uploads", express.static("public/uploads"))
// 🔥 ROUTES
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/comments", commentRoutes)
// 🔥 ROOT TEST
app.get("/", (req, res) => {
  res.send("🚀 Backend running...");
});

// 🔥 ERROR HANDLER (pro hơn)
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
});

// 🔥 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
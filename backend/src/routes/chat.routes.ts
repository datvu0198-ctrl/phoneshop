import { Router } from "express";
import db from "../db.js";

const router = Router();

// 🔥 Chuẩn hóa text
const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, "");

// 🔥 Tách từ
const tokenize = (text: string) => normalize(text).split(" ");

// 🔥 Hàm định dạng tiền tệ (Dùng để gửi kèm nếu muốn hiển thị ngay)
const formatVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
};

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const msg = normalize(message);
    
    const [rows]: any = await db.query("SELECT * FROM products");
    let products = rows;

    // 🔥 Phân tích intent
    const intent = {
      brand: "",
      maxPrice: Infinity,
      minPrice: 0,
      need: [] as string[] // Sửa lỗi 'never'
    };

    // 📱 Hãng
    if (msg.includes("iphone")) intent.brand = "iphone";
    if (msg.includes("samsung")) intent.brand = "samsung";
    if (msg.includes("xiaomi")) intent.brand = "xiaomi";

    // 💰 Xử lý giá tiền (Ví dụ: "dưới 10 triệu" -> lấy số 10)
    const priceMatch = msg.match(/(\d+)/);
    if (priceMatch) {
        // Nếu user nhập "10", ta nhân với 1.000.000 để ra 10 triệu so sánh với DB
        intent.maxPrice = Number(priceMatch[0]) * 1000000;
    }

    // 🎯 Nhu cầu
    if (msg.includes("game")) intent.need.push("gaming");
    if (msg.includes("pin")) intent.need.push("battery");
    if (msg.includes("camera")) intent.need.push("camera");
    if (msg.includes("sinh viên") || msg.includes("rẻ")) intent.need.push("cheap");

    // 🔥 SCORING - Tính điểm ưu tiên
    const scored = products.map((p: any) => {
      let score = 0;
      const name = p.name.toLowerCase();
      // Chuyển đổi p.price về số thực (phòng trường hợp DB lưu là string)
      const price = Number(p.price);

      // ✅ Brand ưu tiên cao nhất
      if (intent.brand && name.includes(intent.brand)) score += 10;

      // ✅ Giá phù hợp túi tiền
      if (price <= intent.maxPrice) score += 5;

      // 🎮 Gaming (Cấu hình cao thường giá trên 8tr)
      if (intent.need.includes("gaming") && price >= 8000000) score += 4;

      // 🔋 Pin trâu
      if (intent.need.includes("battery") && price >= 5000000) score += 3;

      // 📸 Camera
      if (intent.need.includes("camera") && price >= 7000000) score += 4;

      // 🎓 Sinh viên (Ưu tiên giá rẻ)
      if (intent.need.includes("cheap") && price <= 7000000) score += 6;

      return { ...p, price, score }; 
    });

    // 🔥 SORT THEO ĐIỂM & ĐỊNH DẠNG LẠI GIÁ
    const result = scored
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 4)
      .map((p: any) => ({
        ...p,
        // Tạo thêm một field đã định dạng sẵn: "15.000.000 ₫"
        formattedPrice: formatVND(p.price) 
      }));

    // 🔥 Reply thông minh
    let reply = "Mình tìm được mấy con phù hợp nhất cho bạn 👇";
    if (intent.brand) reply = `📱 Các dòng ${intent.brand.toUpperCase()} tốt nhất hiện nay:`;
    if (intent.need.includes("gaming")) reply = "🎮 Top máy cấu hình khủng, chiến game mượt:";
    if (intent.need.includes("camera")) reply = "📸 Điện thoại chụp ảnh sắc nét, xóa phông đỉnh:";

    res.json({
      reply,
      products: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "❌ Có lỗi xảy ra khi tìm kiếm sản phẩm.",
      products: []
    });
  }
});

export default router;
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// trỏ đúng tới /backend/public/uploads
const uploadPath = path.join(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // ✅ chuẩn tuyệt đối
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
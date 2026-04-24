import express from "express"
import { 
  login, 
  register, 
  forgotPassword, 
  resetPassword 
} from "../controllers/auth.controller"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

// 🔥 THÊM 2 DÒNG NÀY
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router
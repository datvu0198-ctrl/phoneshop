import express from "express"
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus
} from "../controllers/order.controller"

const router = express.Router()

router.post("/", createOrder)
router.get("/user/:userId", getOrdersByUser)
router.get("/", getAllOrders)
router.put("/:id", updateOrderStatus)

export default router
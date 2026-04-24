import express from "express"
import { getComments, addComment } from "../controllers/product.controller.js"

const router = express.Router()

// GET comments theo product
router.get("/:productId", getComments)

// POST comment
router.post("/", addComment)

export default router
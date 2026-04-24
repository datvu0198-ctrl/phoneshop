import express from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controllers/product.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Định nghĩa các đường dẫn (Endpoint) cho sản phẩm
router.get("/", getProducts);
router.get("/:id", getProductById); // 👉 đặt lên trên cho rõ ràng

router.post(

  "/",

  upload.fields([

    { name: "images", maxCount: 10 },

    { name: "video", maxCount: 1 }

  ]),

  createProduct

);

router.put(

  "/:id",

  upload.fields([

    { name: "images", maxCount: 10 },

    { name: "video", maxCount: 1 }

  ]),

  updateProduct

);
router.delete("/:id", deleteProduct);

export default router;
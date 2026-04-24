import { Request, Response } from "express"
import { db } from "../db.js"
import fs from "fs"
import path from "path"
import "multer";

declare global {
  namespace Express {
    interface Request {

      file?: Express.Multer.File;

      
    }
  }
}

// 🔥 BASE URL (sau này deploy chỉ cần sửa 1 chỗ)
const BASE_URL = "http://localhost:3000"

// 1. LẤY TẤT CẢ SẢN PHẨM
export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    )

    const products = rows.map((p: any) => {
      let images: string[] = []

      try {
        if (p.images) {
          const parsed = typeof p.images === "string"
            ? JSON.parse(p.images)
            : p.images

          // 👉 thêm BASE_URL cho từng ảnh
          images = parsed.map((img: string) =>
            img.startsWith("http") ? img : `${BASE_URL}${img}`
          )
        }
      } catch (e) {
        console.error("Lỗi parse images:", e)
      }

      return {
        ...p,
        img: p.img ? `${BASE_URL}${p.img}` : "",
        images, // 🔥 QUAN TRỌNG
        video: p.video || ""
      }
    })

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: err })
  }
}

// 2. LẤY CHI TIẾT
export const getProductById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }

    const p = rows[0]

    let images: string[] = []

    try {
      if (p.images) {
        const parsed = typeof p.images === "string"
          ? JSON.parse(p.images)
          : p.images

        images = parsed.map((img: string) =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        )
      }
    } catch (e) {
      console.error("Lỗi parse images:", e)
    }

    const product = {
      ...p,
      img: p.img ? `${BASE_URL}${p.img}` : "",
      images,
      video: p.video || ""
    }

    res.json(product)
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err })
  }
}

// 3. TẠO SẢN PHẨM (UPLOAD ẢNH)
export const createProduct = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      name,
      price,
      rating,
      description
    } = req.body


    const files = req.files as any


    const imageFiles =
      files?.images || []


    const videoFile =
      files?.video?.[0]


    const images = imageFiles.map(
      (file: any) =>
        `/uploads/${file.filename}`
    )


    const video = videoFile
      ? `/videos/${videoFile.filename}`
      : ""


    const img = images[0] || ""


    await db.query(

      `INSERT INTO products
      (
        name,
        price,
        img,
        images,
        video,
        rating,
        description
      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,

      [

        name,

        price,

        img,

        JSON.stringify(images),

        video,

        rating || 0,

        description || ""

      ]

    )


    res.json({

      message: "OK"

    })

  }

  catch (err) {

    console.error(err)

    res.status(500).json({

      message: "Lỗi create product"

    })

  }

}

// 4. CẬP NHẬT (CÓ THỂ ĐỔI ẢNH)
export const updateProduct = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params


    const {
      name,
      price,
      rating,
      description
    } = req.body


    const files = req.files as any


    const imageFiles =
      files?.images || []


    const videoFile =
      files?.video?.[0]


    const images = imageFiles.map(
      (file: any) =>
        `/uploads/${file.filename}`
    )


    const video = videoFile
      ? `/videos/${videoFile.filename}`
      : ""


    const img = images[0] || ""


    await db.query(

      `UPDATE products SET

      name=?,

      price=?,

      img=?,

      images=?,

      video=?,

      rating=?,

      description=?

      WHERE id=?`,

      [

        name,

        price,

        img,

        JSON.stringify(images),

        video,

        rating,

        description,

        id

      ]

    )


    res.json({

      message: "updated"

    })

  }

  catch (err) {

    console.error(err)

    res.status(500).json({

      message: "update failed"

    })

  }

}

// 5. XÓA (XÓA LUÔN ẢNH)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const [rows]: any = await db.query(
      "SELECT * FROM products WHERE id=?",
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }

    const img = rows[0].img

    if (img) {
      const filePath = path.join("public", img)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await db.query("DELETE FROM products WHERE id=?", [id])

    res.json({ message: "Đã xóa sản phẩm" })
  } catch (err) {
    res.status(500).json({ message: "Xóa thất bại", error: err })
  }
}
export const getComments = async (req: Request, res: Response) => {
  const { productId } = req.params

  const [rows] = await db.query(
    "SELECT * FROM comments WHERE productId=?",
    [productId]
  )

  res.json(rows)
}

export const addComment = async (
  req: Request,
  res: Response
) => {

  try {

    const {

      productId,

      user_id,

      user,

      content,

      rating

    } = req.body


    await db.query(

      `
      INSERT INTO comments
      (
        productId,
        user_id,
        user,
        content,
        rating
      )

      VALUES (?, ?, ?, ?, ?)
      `,

      [

        productId,

        user_id,

        user,

        content,

        rating

      ]

    )


    res.json({

      message: "OK"

    })

  }

  catch (err) {

    console.error(err)

    res.status(500).json({

      message: "Lỗi add comment"

    })

  }

}
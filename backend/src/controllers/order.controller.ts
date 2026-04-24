import { Request, Response } from "express"
import db from "../db"

export const createOrder = async (req: Request, res: Response) => {
  const { user_id, items, total, payment_method, customer_info } = req.body

  const [result]: any = await db.query(
    `INSERT INTO orders 
    (user_id, total, payment_method, name, phone, address, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      total,
      payment_method,
      customer_info.name,
      customer_info.phone,
      customer_info.address,
      customer_info.email
    ]
  )

  const orderId = result.insertId

  for (const item of items) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES (?, ?, ?, ?)`,
      [orderId, item.id, item.quantity, item.price]
    )
  }

  res.json({ message: "Order created", orderId })
}

export const getOrdersByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId

  const [orders]: any = await db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId]
  )

   for (let order of orders) {
  const [items]: any = await db.query(
    `SELECT 
      oi.id,
      oi.quantity,
      oi.price,
      p.name,
      p.img
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?`,
    [order.id]
  )

  order.items = items
}

  res.json(orders)
}

export const getAllOrders = async (req: Request, res: Response) => {
  const [rows]: any = await db.query(`
    SELECT 
      o.id,
      o.total,
      o.status,
      o.created_at,
      o.payment_method,
      o.name,
      o.phone,
      o.address,
      o.email,
      oi.product_id,
      oi.quantity,
      oi.price,
      p.name AS product_name,
      p.img AS product_img
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `)

  const ordersMap: any = {}

  rows.forEach((row: any) => {
    if (!ordersMap[row.id]) {
      ordersMap[row.id] = {
        id: row.id,
        total: row.total,
        status: row.status || "pending",
        createdAt: row.created_at,
        payment: row.payment_method,
        customer: {
          name: row.name,
          phone: row.phone,
          address: row.address,
          email: row.email
        },
        items: []
      }
    }

    if (row.product_id) {
      ordersMap[row.id].items.push({
        id: row.product_id,
        name: row.product_name,
        img: row.product_img,
        quantity: row.quantity,
        price: row.price
      })
    }
  })

  res.json(Object.values(ordersMap))
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body

  await db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id]
  )

  res.json({ message: "Updated" })
}
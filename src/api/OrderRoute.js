import express from "express"
import { client } from "../LIB/DB-Connect.js"
import AuthenticationMiddleware from "../MIDDLEWARES/AuthenticationMiddleware.js"
import NetworkConnectionCheckMiddleware from "../MIDDLEWARES/NetworkConnectionCheckMiddleware.js"
import { validateOrderItem } from "../VALIDATORS/OrderRouteValidator.js"
const Orders = client.collection("orders")
const Products = client.collection("products")
const router = express.Router()

//============= This route get all order items from logged in seller =============
//================================================================================
router.get("/order_items", AuthenticationMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0
  const sort = req.query.sort || { shipping_limit_date: 1 }
  const user = req.session.user
  try {
    // Merge products and order
    const orderItems = await Orders.aggregate([
      { $match: { seller_id: user } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "product_id",
          as: "product_info",
        },
      },
      { $unwind: "$product_info" },
      {
        $project: {
          id: "$order_item_id",
          product_id: "$product_id",
          product_category: "$product_info.product_category_name",
          price: "$price",
          date: "$shipping_limit_date",
        },
      },
      { $sort: sort },
      { $skip: offset },
      { $limit: limit },
    ]).toArray()

    if (orderItems < 1) return res.status(400).json({ error: "Invalid order ID, can't find an order" })
    const total = await Orders.countDocuments({ seller_id: user })
    res.status(200).json({ data: orderItems, total: total, limit: limit, offset: offset })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

//================ This route update a particular product ===============
//=======================================================================
router.put("/order_items/:id", AuthenticationMiddleware, NetworkConnectionCheckMiddleware, async (req, res) => {
  const { id: orderItemId } = req.params
  const { shipping_limit_date, price, freight_value } = req.body
  const { error, value } = validateOrderItem(req.body)

  if (error) return res.status(400).json({ error: error.details.map((e) => e.context.label) })
  if (!orderItemId || typeof orderItemId !== "string")
    return res.status(400).json({ error: "Invalid order ID, can't find an order" })
  try {
    const orderItem = await Orders.findOne({
      order_id: orderItemId,
      seller_id: req.session.user,
    })

    if (!orderItem) return res.status(400).json({ error: "Invalid order ID, can't find an order" })
    await Orders.findOneAndUpdate(
      { order_id: orderItemId },
      {
        $set: {
          shipping_limit_date: shipping_limit_date,
          price: price,
          freight_value: freight_value,
        },
      }
    )
    return res.status(200).json({ data: "Order updated successfully" })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

//================ This route get a particular order ====================
//=======================================================================
router.get("/order_items/:id", AuthenticationMiddleware, async (req, res) => {
  const { id: orderItemId } = req.params

  if (!orderItemId || typeof orderItemId !== "string")
    return res.status(400).json({ error: "Invalid order ID, can't find an order" })
  try {
    const orderItem = await Orders.findOne({
      order_id: orderItemId,
      seller_id: req.session.user,
    })
    if (!orderItem) return res.status(400).json({ error: "Invalid order ID, can't find an order" })
    const productItem = await Products.findOne({ product_id: orderItem.product_id })
    // Remove data that are not needed
    const {
      _id,
      product_length_cm,
      product_height_cm,
      product_width_cm,
      product_description_lenght,
      product_name_lenght,
      product_photos_qty,
      ...productData
    } = productItem
    // Return prduct id wthout its _id
    return res.json({ data: Object.assign({}, orderItem, productData) })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

//========= This route delete an ordered items from logged in seller data in the database =========
//=================================================================================================
router.delete("/order_items/:id", AuthenticationMiddleware, NetworkConnectionCheckMiddleware, async (req, res) => {
  const { id: orderItemId } = req.params
  if (!orderItemId || typeof orderItemId !== "string")
    return res.status(400).json({ error: "Invalid order ID, can't find an order" })

  try {
    const orderItem = await Orders.findOne({
      order_id: orderItemId,
      seller_id: req.session.user,
    })
    if (orderItem) await Orders.deleteOne({ order_id: orderItemId })
    else return res.status(400).json({ error: "Invalid order ID, can't find an order" })
    return res.json({ data: "Order item deleted successfully" })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

export default router

import express from "express"
import { client } from "../LIB/DB-Connect.js"
import NetworkConnectionCheckMiddleware from "../MIDDLEWARES/NetworkConnectionCheckMiddleware.js"
const router = express.Router()
const Products = client.collection("products")

//================= This route get all product ===================
//===================================================================
router.get("/all_products", NetworkConnectionCheckMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const offset = parseInt(req.query.offset) || 0

  try {
    const allProducts = await Products.find().limit(limit).skip(offset).toArray()
    const total = await Products.countDocuments()
    if (allProducts.length < 1) return res.status(400).json({ error: "Product is empty" })
    return res.status(200).json({ data: allProducts, offset, limit, total })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

export default router

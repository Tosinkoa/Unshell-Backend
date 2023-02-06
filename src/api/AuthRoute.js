import express from "express"
import { client } from "../LIB/DB-Connect.js"
import NetworkConnectionCheckMiddleware from "../MIDDLEWARES/NetworkConnectionCheckMiddleware.js"
const Sellers = client.collection("sellers")

const router = express.Router()

//=========================== Login Route =============================
//======================================================================
router.post("/login", NetworkConnectionCheckMiddleware, async (req, res) => {
  try {
    const { username, password } = req.body
    const SellerExist = await Sellers.findOne({ seller_id: username, seller_zip_code_prefix: password })
    if (!SellerExist) return res.status(400).json({ error: "Wrong username or password" })
    req.session.user = SellerExist.seller_id
    return res.status(200).json({ data: "Successfully Logged In" })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

//================== This route check if user is authenticated ==================
//======================================================================
router.get("/auth", (req, res) => {
  try {
    if (!req.session.user) return res.status(400).send(false)
    return res.status(200).send(true)
  } catch (e) {
    res.status(400).send(false)
  }
})

//=========================== Logout Route =============================
//======================================================================
router.get("/logout", async (req, res) => {
  try {
    delete req.session.user
    return res.status(200).json({ data: "Successfully Logged Out" })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

export default router

import express from "express"
import { client } from "../LIB/DB-Connect.js"
import AuthenticationMiddleware from "../MIDDLEWARES/AuthenticationMiddleware.js"
import NetworkConnectionCheckMiddleware from "../MIDDLEWARES/NetworkConnectionCheckMiddleware.js"
import { validateUser } from "../VALIDATORS/UserRouteValidator.js"
const Sellers = client.collection("sellers")

const router = express.Router()

//================= This route update logged in seller details ================
//=============================================================================
router.put("/account", AuthenticationMiddleware, NetworkConnectionCheckMiddleware, async (req, res) => {
  const loggedInUser = req.session.user
  const { seller_city, seller_state } = req.body

  const { error, value } = validateUser(req.body)
  if (error) return res.status(400).json({ error: error.details.map((e) => e.context.label) })

  try {
    await Sellers.findOneAndUpdate(
      { seller_id: loggedInUser },
      { $set: { seller_city: seller_city, seller_state: seller_state.toUpperCase() } }
    )
    return res.status(200).json({ data: "User detail updated successfully" })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

//================ This route get a particular seller details ====================
//=======================================================================
router.get("/account_details", AuthenticationMiddleware, async (req, res) => {
  try {
    const sellerDetails = await Sellers.findOne({
      seller_id: req.session.user,
    })
    if (!sellerDetails) return res.status(400).json({ error: "Can't find seller details" })
    return res.json({ data: sellerDetails })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json({ error: "Server error, try again!" })
  }
})

export default router

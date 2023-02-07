import request from "supertest"
import app from "../../../app.js"
import { client } from "../../LIB/DB-Connect.js"

const Sellers = client.collection("sellers")

describe("GET /order_items", () => {
  it("should return 401 if user is not authenticated", async () => {
    try {
      const response = await request(app).get("/order_items")
      expect(response.status).toBe(401)
      expect(response.body.error).toBe("You're unauthorized, you need to login")
    } catch (error) {
      console.error(error)
    }
  })

  let user
  beforeAll(async () => {
    user = await Sellers.findOne({
      seller_id: "411f3b52d857390502ee4e4d5ceabc2d",
      seller_zip_code_prefix: "09400",
    })
    user = user.seller_id
  })

  it("should return order items for authenticated user", async () => {
    try {
      const agent = request.agent(app)

      await agent.post("/login").send({ username: "d2e753bb80b7d4faa77483ed00edc8ca", password: "45810" }).expect(200)
      const response = await agent.get("/order_items").expect(200)

      const data = response.body.data
      const total = response.body.total
      const limit = response.body.limit
      const offset = response.body.offset

      // Assertions to check the response body
      expect(Array.isArray(data)).toBe(true)
      expect(data[0]).toHaveProperty("id")
      expect(typeof data[0].id).toBe("string")
      expect(data[0]).toHaveProperty("product_id")
      expect(typeof data[0].product_id).toBe("string")
      expect(data[0]).toHaveProperty("product_category")
      expect(typeof data[0].product_category).toBe("string")
      expect(data[0]).toHaveProperty("price")
      expect(typeof data[0].price).toBe("number")
      expect(data[0]).toHaveProperty("date")
      expect(typeof data[0].product_category).toBe("string")

      expect(typeof total).toBe("number")
      expect(typeof limit).toBe("number")
      expect(typeof offset).toBe("number")
    } catch (error) {
      console.error(error)
    }
  })
})

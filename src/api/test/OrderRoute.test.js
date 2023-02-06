import request from "supertest"
import app from "../../../app.js"
import { client } from "../../LIB/DB-Connect.js"

const Sellers = client.collection("sellers")

describe("GET /order_items", () => {
  it("should return 401 if user is not authenticated", async () => {
    const response = await request(app).get("/order_items")

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("You're unauthorized, you need to login")
  })

  let user
  beforeAll(async () => {
    user = await Sellers.findOne({
      seller_id: "411f3b52d857390502ee4e4d5ceabc2d",
      seller_zip_code_prefix: "09400",
    })
    user = user.seller_id
  })

  // it("should return order items for authenticated user", async (done) => {
  //   const agent = request.agent(app)

  //   await agent.post("/login").send({ username: "d2e753bb80b7d4faa77483ed00edc8ca", password: "45810" }).expect(200)

  //   const response = await agent.get("/order_items").expect(200)
  //   console.log("=============================")
  //   console.log("=============================")
  //   console.log("BODY:", response.body)
  //   console.log("=============================")
  //   console.log("=============================")
  //   // expect(response.body).toEqual(expect.stringContaining("json"))
  // })
})

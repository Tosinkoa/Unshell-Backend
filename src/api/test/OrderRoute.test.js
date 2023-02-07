import request from "supertest"
import app from "../../../app.js"

describe("Order Route Test", () => {
  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("GET /order_items", () => {
    it("should return 401 with error message if user is not authenticated", async () => {
      try {
        const response = await request(app).get("/order_items")
        expect(response.status).toBe(401)
        expect(response.body.error).toBe("You're unauthorized, you need to login")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("should return order items for authenticated user", async () => {
      try {
        const agent = request.agent(app)
        await agent.post("/login").send(authenticatedUserDetails).expect(200)
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
        console.log(error)
      }
    })
  })

  let authenticatedUserDetails
  beforeAll(async () => {
    authenticatedUserDetails = { username: "d2e753bb80b7d4faa77483ed00edc8ca", password: "45810" }
  })
  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("PUT /order_items/:id", () => {
    it("should return 401 with error message if user is not authenticated", async () => {
      try {
        const orderItemId = "21fb27ca0d5674a275138792e721612a"
        const response = await request(app).put(`/order_items/${orderItemId}`)
        expect(response.status).toBe(401)
        expect(response.body.error).toBe("You're unauthorized, you need to login")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("should return response status of 400 with error message if order didnot exist", async () => {
      try {
        const agent = request.agent(app)
        // Invalid Id
        const orderItemId = "1234567890"
        const orderItemData = {
          shipping_limit_date: "2017-11-03T13:05:45.000+00:00",
          price: 100,
          freight_value: 20,
        }

        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const response = await agent.put(`/order_items/${orderItemId}`).send(orderItemData).expect(400)
        const error = response.body.error
        expect(error).toBe("Invalid order ID, can't find an order")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("Returned error if request body are not provided", async () => {
      try {
        const agent = request.agent(app)
        const orderItemId = "21fb27ca0d5674a275138792e721612a"
        const orderItemData = {
          shipping_limit_date: "",
          price: 0,
          freight_value: 0,
        }

        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const response = await agent.put(`/order_items/${orderItemId}`).send(orderItemData).expect(400)

        const error = response.body.error
        expect(typeof error).toBe("object")
        expect(typeof error[0]).toBe("string")
        expect(typeof error[1]).toBe("string")
        expect(typeof error[2]).toBe("string")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("should update order item for authenticated user", async () => {
      try {
        const agent = request.agent(app)
        const orderItemId = "21fb27ca0d5674a275138792e721612a"
        const orderItemData = {
          shipping_limit_date: "2017-11-03T13:05:45.000+00:00",
          price: 100,
          freight_value: 20,
        }

        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const response = await agent.put(`/order_items/${orderItemId}`).send(orderItemData).expect(200)
        const data = response.body.data

        expect(data).toBe("Order updated successfully")
      } catch (error) {
        console.log(error)
      }
    })
  })

  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("GET /order_items/:id", () => {
    it("should return 401 with error message if user is not authenticated", async () => {
      try {
        const orderItemId = "21fb27ca0d5674a275138792e721612a"
        const response = await request(app).get(`/order_items/${orderItemId}`)
        expect(response.status).toBe(401)
        expect(response.body.error).toBe("You're unauthorized, you need to login")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("Should return an error if order item id is invalid", async () => {
      const agent = request.agent(app)
      const orderItemId = 123456
      await agent.post("/login").send(authenticatedUserDetails).expect(200)

      const orderItemData = {
        shipping_limit_date: "2017-11-03T13:05:45.000+00:00",
        price: 100,
        freight_value: 20,
      }
      const response = await agent.get(`/order_items/${orderItemId}`).send(orderItemData).expect(400)
      expect(response.body).toHaveProperty("error", "Invalid order ID, can't find an order")
    })

    //========================================================================
    it("should return order items for authenticated user", async () => {
      try {
        const agent = request.agent(app)
        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const orderItemId = "21fb27ca0d5674a275138792e721612a"
        const response = await agent.get(`/order_items/${orderItemId}`).expect(200)
        const data = response.body.data

        // Assertions to check the response body
        expect(typeof data).toBe("object")
        expect(data).toHaveProperty("_id")
        expect(typeof data._id).toBe("string")
        expect(data).toHaveProperty("order_id")
        expect(typeof data.order_id).toBe("string")
        expect(data).toHaveProperty("product_id")
        expect(typeof data.product_id).toBe("string")
        expect(data).toHaveProperty("seller_id")
        expect(typeof data.seller_id).toBe("string")
        expect(data).toHaveProperty("shipping_limit_date")
        expect(typeof data.shipping_limit_date).toBe("string")
        expect(data).toHaveProperty("price")
        expect(typeof data.price).toBe("number")
        expect(data).toHaveProperty("freight_value")
        expect(typeof data.freight_value).toBe("number")
        expect(data).toHaveProperty("product_category_name")
        expect(typeof data.product_category_name).toBe("string")
        expect(data).toHaveProperty("product_weight_g")
        expect(typeof data.product_weight_g).toBe("number")
      } catch (error) {
        console.log(error)
      }
    })
  })
})

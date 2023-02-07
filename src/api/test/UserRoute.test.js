import request from "supertest"
import app from "../../../app.js"

describe("User Route Test", () => {
  //==========================DESCRIBE BLOCK==============================
  //======================================================================

  let authenticatedUserDetails
  beforeAll(async () => {
    authenticatedUserDetails = { username: "d2e753bb80b7d4faa77483ed00edc8ca", password: "45810" }
  })

  describe("PUT /account", () => {
    it("should return 401 with error message if user is not authenticated", async () => {
      try {
        const response = await request(app).put("/account")
        expect(response.status).toBe(401)
        expect(response.body.error).toBe("You're unauthorized, you need to login")
      } catch (error) {
        console.log(error)
      }
    })

    //=======================================================================
    it("should return successful message when authenticated update their account details (seller_city, seller_state)", async () => {
      try {
        const agent = request.agent(app)
        const sellerDetails = {
          seller_state: "IB",
          seller_city: "Ibadan",
        }
        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const response = await agent.put("/account").send(sellerDetails).expect(200)

        const data = response.body.data
        expect(data).toBe("User detail updated successfully")
      } catch (error) {
        console.log(error)
      }
    })
  })

  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("GET /account_details", () => {
    it("should return 401 with error message if user is not authenticated", async () => {
      try {
        const response = await request(app).get("/account_details")
        expect(response.status).toBe(401)
        expect(response.body.error).toBe("You're unauthorized, you need to login")
      } catch (error) {
        console.log(error)
      }
    })

    //=======================================================================
    it("should return authenticated user account details", async () => {
      try {
        const agent = request.agent(app)
        await agent.post("/login").send(authenticatedUserDetails).expect(200)
        const response = await agent.get("/account_details").expect(200)
        const data = response.body.data

        // Assertions to check the response body
        expect(typeof data).toBe("object")
        expect(data).toHaveProperty("_id")
        expect(typeof data._id).toBe("string")
        expect(data).toHaveProperty("seller_id")
        expect(typeof data.seller_id).toBe("string")
        expect(data).toHaveProperty("seller_zip_code_prefix")
        expect(typeof data.seller_zip_code_prefix).toBe("string")
        expect(data).toHaveProperty("seller_city")
        expect(typeof data.seller_city).toBe("string")
        expect(data).toHaveProperty("seller_state")
        expect(typeof data.seller_state).toBe("string")
      } catch (error) {
        console.log(error)
      }
    })
  })
})

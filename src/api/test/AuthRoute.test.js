import request from "supertest"
import app from "../../../app.js"

describe("Auth Route Test", () => {
  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("POST /login", () => {
    it("login route responds with 200 and returns success message", async () => {
      try {
        const response = await request(app)
          .post("/login")
          .send({ username: "4cf490a58259286ada5ba8525ba9e84a", password: "14910" })
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("data", "Successfully Logged In")
      } catch (error) {
        console.log(error)
      }
    })

    //========================================================================
    it("logout route successfully logout user and return 200 response", async () => {
      try {
        const response = await request(app).get("/logout")
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("data", "Successfully Logged Out")
      } catch (error) {
        console.log(error)
      }
    })
  })
})

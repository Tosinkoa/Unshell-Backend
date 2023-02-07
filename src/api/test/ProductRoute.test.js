import request from "supertest"
import app from "../../../app"

describe("Product Route Test", () => {
  //==========================DESCRIBE BLOCK==============================
  //======================================================================
  describe("GET /all_products", () => {
    it("should return all product", async () => {
      try {
        const response = await request(app).get("/all_products").expect(200)

        const data = response.body.data
        const total = response.body.total
        const limit = response.body.limit
        const offset = response.body.offset

        // Assertions to check the response body
        expect(Array.isArray(data)).toBe(true)
        expect(data[0]).toHaveProperty("_id")
        expect(typeof data[0]._id).toBe("string")
        expect(data[0]).toHaveProperty("product_id")
        expect(typeof data[0].product_id).toBe("string")
        expect(data[0]).toHaveProperty("product_category_name")
        expect(typeof data[0].product_category_name).toBe("string")
        expect(data[0]).toHaveProperty("product_name_lenght")
        expect(typeof data[0].product_name_lenght).toBe("number")
        expect(data[0]).toHaveProperty("product_photos_qty")
        expect(typeof data[0].product_photos_qty).toBe("number")
        expect(data[0]).toHaveProperty("product_weight_g")
        expect(typeof data[0].product_weight_g).toBe("number")
        expect(data[0]).toHaveProperty("product_length_cm")
        expect(typeof data[0].product_length_cm).toBe("number")
        expect(data[0]).toHaveProperty("product_height_cm")
        expect(typeof data[0].product_height_cm).toBe("number")
        expect(data[0]).toHaveProperty("product_width_cm")
        expect(typeof data[0].product_width_cm).toBe("number")

        expect(typeof total).toBe("number")
        expect(typeof limit).toBe("number")
        expect(typeof offset).toBe("number")
      } catch (error) {
        console.log(error)
      }
    })
  })
})

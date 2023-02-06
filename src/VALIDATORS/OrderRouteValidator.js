import Joi from "joi"

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false })

const orderItemSchema = Joi.object({
  price: Joi.number().min(10).max(1000).required().label("Price must be a min of 10 and max of 1000"),
  freight_value: Joi.number().min(10).max(100).required().label("Freight must be a min of 10 and max of 100"),
  shipping_limit_date: Joi.date().required().label("Kindly add a valid date"),
})

export const validateOrderItem = validator(orderItemSchema)

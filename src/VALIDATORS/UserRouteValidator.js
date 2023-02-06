import Joi from "joi"

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false })

const userSchema = Joi.object({
  seller_city: Joi.string()
    .min(2)
    .max(40)
    .required()
    .label("Seller city must be a minimum of 2 and max of 40 characters")
    .trim(),
  seller_state: Joi.string().min(2).max(2).required().label("Seller state be min and max of 2 characters").trim(),
})

export const validateUser = validator(userSchema)

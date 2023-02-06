import dotenv from "dotenv"
import { MongoClient } from "mongodb"
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)

const dbConnect = async () => {
  try {
    await mongoClient.connect()
    // console.log("MongoDB Connected Successfully✅✅✅...")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export const client = mongoClient.db(process.env.DATABASE)
export default dbConnect

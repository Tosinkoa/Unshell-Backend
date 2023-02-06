import dotenv from "dotenv"
import app from "./app.js"
dotenv.config()

// TODO ==> Work on middleware, add all test and make good comment

const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => console.log(`Server running on PORT:${5000}`))

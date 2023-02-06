import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import session from "express-session"
import dbConnect from "./src/LIB/DB-Connect.js"
import rootRoute from "./src/rootRoute.js"
dbConnect()
const app = express()

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
)

app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET, PUT, POST, DELETE"],
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())
app.use(cookieParser())
rootRoute(app)
export default app

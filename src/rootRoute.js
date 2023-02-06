import Login from "./api/AuthRoute.js"
import OrderRoute from "./api/OrderRoute.js"
import ProductRoute from "./api/ProductRoute.js"
import UserRoute from "./api/UserRoute.js"

const rootRoute = (app) => {
  app.use(Login)
  app.use(OrderRoute)
  app.use(UserRoute)
  app.use(ProductRoute)
}

export default rootRoute

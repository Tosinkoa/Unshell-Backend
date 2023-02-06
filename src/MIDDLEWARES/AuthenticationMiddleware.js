const AuthenticationMiddleware = (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "You're unauthorized, you need to login" })
    }
    next()
  } catch (e) {
    console.log(e)
  }
}

export default AuthenticationMiddleware

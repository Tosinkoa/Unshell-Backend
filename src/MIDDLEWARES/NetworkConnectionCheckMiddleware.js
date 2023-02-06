import http2 from "http2"

const NetworkConnectionCheckMiddleware = async (req, res, next) => {
  try {
    const isConnected = () => {
      return new Promise((resolve) => {
        const client = http2.connect("https://www.google.com")
        client.on("connect", () => {
          resolve(true)
          client.destroy()
        })
        client.on("error", () => {
          resolve(false)
          client.destroy()
        })
      })
    }

    const result = await isConnected()
    if (result === false)
      return res.status(400).send({ error: "Connection error, Make sure your internet connection is active!" })
    next()
  } catch (e) {
    console.log(e)
    return res.status(500)
  }
}

export default NetworkConnectionCheckMiddleware

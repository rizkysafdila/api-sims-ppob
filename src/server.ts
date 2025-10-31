import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/database"
import logger from "./config/logger"
import morganMiddleware from "./middleware/morgan"
import errorMiddleware from "./middleware/error"
import router from "./routes"
import { envConfig } from "./config/env"

dotenv.config()
const app = express()

app.use(morganMiddleware)

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use('/', router)
app.use(errorMiddleware)

const start = async () => {
  await connectDB()
  app.listen(envConfig.APP_PORT, () => {
    logger.info(`🚀 Server running at ${envConfig.APP_URL}:${envConfig.APP_PORT}`)
  })
}

// start()

export default app

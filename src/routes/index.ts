import { Router } from "express"
import authRoutes from "./auth.routes"
import profileRouter from "./profile.route"
import bannerRouter from "./banner.routes"
import serviceRouter from "./service.routes"
import transactionRouter from "./transaction.routes"
import path from "path"

const router = Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'))
})

router.use(authRoutes)
router.use("/profile", profileRouter)
router.use("/banner", bannerRouter)
router.use("/services", serviceRouter)
router.use(transactionRouter)

export default router

import { Router } from "express"
import authRoutes from "./auth.routes"
import profileRouter from "./profile.route"
import bannerRouter from "./banner.routes"
import serviceRouter from "./service.routes"

const router = Router()

router.use(authRoutes)
router.use("/profile", profileRouter)
router.use("/banner", bannerRouter)
router.use("/services", serviceRouter)

export default router

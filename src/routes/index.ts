import { Router } from "express"
import authRoutes from "./auth.routes"
import profileRouter from "./profile.route"
import bannerRouter from "./banner.routes"

const router = Router()

router.use(authRoutes)
router.use("/profile", profileRouter)
router.use("/banner", bannerRouter)

export default router

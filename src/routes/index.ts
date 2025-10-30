import { Router } from "express"
import authRoutes from "./auth.routes"
import profileRouter from "./profile.route"

const router = Router()

router.use(authRoutes)
router.use("/profile", profileRouter)

export default router

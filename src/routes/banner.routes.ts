import { Router } from "express"
import { BannerController } from "../controllers/banner.controller"

const bannerRouter: Router = Router()

const bannerController = new BannerController()

bannerRouter.get("/", bannerController.getAll)

export default bannerRouter

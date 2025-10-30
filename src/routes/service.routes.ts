import { Router } from "express"
import { ServiceController } from "../controllers/service.controller"
import authMiddleware from "../middleware/auth"

const serviceRouter: Router = Router()
serviceRouter.use(authMiddleware)

const serviceController = new ServiceController()

serviceRouter.get("/", serviceController.getAll)

export default serviceRouter

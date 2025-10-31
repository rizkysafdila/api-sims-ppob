import { Router } from "express"
import authMiddleware from "../middleware/auth"
import { ProfileController } from "../controllers/profile.controller"
import { upload } from "../utils/upload"

const profileRouter: Router = Router()
profileRouter.use(authMiddleware)

const profileController = new ProfileController()

profileRouter.get('/', profileController.getProfile);
profileRouter.put('/update', profileController.updateProfile);
profileRouter.put('/image', upload.single('file'), profileController.updateProfileImage);


export default profileRouter

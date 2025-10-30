import { Response, NextFunction } from 'express'
import { ProfileService } from '../services/profile.service'
import { AuthRequest } from '../types/auth.type'

const profileService = new ProfileService()

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.userId!)
      res.json(profile)
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { first_name, last_name } = req.body
      const result = await profileService.updateProfile(req.userId!, first_name, last_name)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async updateProfileImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const imageUrl = req.file?.path || req.body.image_url
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'No image provided' })
      }

      const result = await profileService.updateProfileImage(req.userId!, imageUrl)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
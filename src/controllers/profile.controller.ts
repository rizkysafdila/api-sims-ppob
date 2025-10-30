import { Response, NextFunction } from 'express'
import { ProfileService } from '../services/profile.service'
import { AuthRequest } from '../types/auth.type'
import { errorResponse, successResponse } from '../utils/response'
import { ZodError } from 'zod'

const profileService = new ProfileService()

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.user_id!)
      res.json(
        res.status(200).json(successResponse(0, 'Sukses', profile))
      )
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { first_name, last_name } = req.body
      const result = await profileService.updateProfile(req.user_id!, first_name, last_name)
      res.json(
        successResponse(0, 'Update Pofile berhasil', result)
      )
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      }
    }
  }

  // TODO: profile image validation
  async updateProfileImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const imageUrl = req.file?.path || req.body.image_url
      
      if (!imageUrl) {
        return res.status(400).json(
          errorResponse(102, 'No image provided')
        )
      }

      const result = await profileService.updateProfileImage(req.user_id!, imageUrl)
      res.json(
        successResponse(0, 'Profile image updated successfully', result)
      )
    } catch (error) {
      res.status(400).json(
        errorResponse(108, error instanceof Error ? error.message : 'Failed to update profile image')
      )
    }
  }
}
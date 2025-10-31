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
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      }

      next(error)
    }
  }

  async updateProfileImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await profileService.updateProfileImage(req.user_id, req.file);
      res.status(200).json(
        successResponse(0, 'Update Profile Image berhasil', result)
      );
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      }

      next(error)
    }
  }
}
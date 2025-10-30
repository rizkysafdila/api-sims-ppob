import { Request, Response, NextFunction } from 'express'
import { BannerService } from '../services/banner.service'
import { successResponse } from '../utils/response'

const bannerService = new BannerService()

export class BannerController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await bannerService.getAllBanners()
      res.status(200).json(successResponse(0, 'Sukses', banners))
    } catch (error) {
      next(error)
    }
  }
}
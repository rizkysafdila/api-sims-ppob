import { Request, Response, NextFunction } from 'express'
import { BannerService } from '../services/banner.service'

const bannerService = new BannerService()

export class BannerController {
  async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await bannerService.getBanners()
      res.json(banners)
    } catch (error) {
      next(error)
    }
  }
}
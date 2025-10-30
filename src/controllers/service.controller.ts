import { Response, NextFunction } from 'express'
import { ServiceService } from '../services/service.service'
import { AuthRequest } from '../types/auth.type'

const serviceService = new ServiceService()

export class ServiceController {
  async getServices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getServices()
      res.json(services)
    } catch (error) {
      next(error)
    }
  }
}
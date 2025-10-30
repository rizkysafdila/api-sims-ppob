import { Response, NextFunction } from 'express'
import { ServiceService } from '../services/service.service'
import { AuthRequest } from '../types/auth.type'
import { successResponse } from '../utils/response'

const serviceService = new ServiceService()

export class ServiceController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getAllServices()
      res.status(200).json(successResponse(0, 'Sukses', services))
    } catch (error) {
      next(error)
    }
  }
}
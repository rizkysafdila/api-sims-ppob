import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { successResponse, errorResponse } from '../utils/response'
import { AuthValidation } from '../validations/auth.validation'
import z, { ZodError } from 'zod'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, first_name, last_name } = req.body
      await authService.register(email, password, first_name, last_name)
      res.status(200).json(
        successResponse(0, 'Registrasi berhasil silahkan login', null)
      )
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      } else if (error.cause === 'email.exists') {
        return res.status(400).json(
          errorResponse(102, error.message)
        )
      }

      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password} = req.body
      const result = await authService.login(email, password)
      res.json(
        successResponse(0, 'Login Sukses', { token: result.token })
      )
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      } else if (error.cause === 'invalid') {
        return res.status(401).json(
          errorResponse(103, error.message)
        )
      }

      next(error)
    }
  }
}
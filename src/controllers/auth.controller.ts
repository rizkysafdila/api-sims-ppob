import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { successResponse, errorResponse } from '../utils/response'
import { AuthValidation } from '../validations/auth.validation'
import z, { ZodError } from 'zod'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = AuthValidation.REGISTER.parse(req.body)
      const result = await authService.register(
        validatedData.email,
        validatedData.password,
        validatedData.first_name,
        validatedData.last_name,
      )
      res.status(200).json(
        successResponse(0, 'Registrasi berhasil silahkan login', null)
      )
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json(
          errorResponse(102, error.issues[0].message, null)
        )
      } else if (error.cause === 'email.exists') {
        res.status(400).json(
          errorResponse(102, error.message, null)
        )
      }

      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = AuthValidation.LOGIN.parse(req.body)
      const result = await authService.login(validatedData.email, validatedData.password)
      res.json(
        successResponse(0, 'Login successful', result)
      )
    } catch (error) {
      next(error)
    }
  }
}
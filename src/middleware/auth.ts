import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { envConfig } from "../config/env"
import { errorResponse } from "../utils/response"
import { AuthRequest } from "../types/auth.type"
import { SessionService } from "../services/session.service"

const sessionService = new SessionService()

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  const token = authorization && authorization.split(" ")[1]

  const tokenId = sessionService.getTokenId(token)

  if (!token || !tokenId) {
    return res.status(401).json(errorResponse(108, "Token tidak tidak valid atau kadaluwarsa"))
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET!) as { email: string, user_id: number }
    req.user_id = decoded.user_id

    next()
  } catch (error) {
    return res.status(401).json(errorResponse(108, "Token tidak tidak valid atau kadaluwarsa"))
  }
}

export default authMiddleware

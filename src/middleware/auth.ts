import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { envConfig } from "../config/env"
import { errorResponse } from "../utils/response"
import { AuthRequest } from "../types/auth.type"

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"]
  const token = authorization && authorization.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET!) as { userId: number }
    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(403).json(errorResponse(100, "Invalid or expired token"))
  }
}

export default authMiddleware

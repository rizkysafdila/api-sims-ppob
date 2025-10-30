import { Request } from "express"

export interface AuthRequest extends Request {
  user_id?: number
}

export interface User {
  id: number
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  id: number
  user_id: number
  first_name: string
  last_name: string
  created_at: Date
  updated_at: Date
}
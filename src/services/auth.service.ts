import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database'
import { envConfig } from '../config/env'
import { User } from '../types/auth.type'
import { AuthValidation } from '../validations/auth.validation'

export class AuthService {
  async register(email: string, password: string, first_name: string, last_name: string) {
    const client = await pool.connect()
    
    try {
      const validatedData = AuthValidation.REGISTER.parse({ email, password, first_name, last_name })

      const userCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [validatedData.email]
      )

      if (userCheck.rows.length > 0) {
        throw new Error('Email already exists', { cause: 'email.exists' })
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10)

      await client.query('BEGIN')

      const userResult = await client.query<User>(
        'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
        [validatedData.email, hashedPassword]
      )

      const userId = userResult.rows[0].id

      await client.query(
        'INSERT INTO user_profiles (user_id, first_name, last_name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, validatedData.first_name, validatedData.last_name]
      )

      await client.query(
        'INSERT INTO balances (user_id, amount, updated_at) VALUES ($1, 0, NOW())',
        [userId]
      )

      await client.query('COMMIT')

      return { userId }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async login(email: string, password: string) {
    try {
      const validatedData = AuthValidation.LOGIN.parse({ email, password })

      const result = await pool.query<Pick<User, 'id' | 'email' | 'password'>>(
        'SELECT id, email, password FROM users WHERE email = $1',
        [validatedData.email]
      )

      if (result.rows.length === 0) {
        throw new Error('Username atau password salah', { cause: 'invalid' })
      }

      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password)

      if (!isValidPassword) {
        throw new Error('Username atau password salah', { cause: 'invalid' })
      }

      const token = jwt.sign({ email: user.email, user_id: user.id }, envConfig.JWT_SECRET!, { expiresIn: '12h' })

      await pool.query(
        'INSERT INTO sessions (user_id, token, created_at, expires_at, last_accessed_at) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'7 days\', NOW())',
        [user.id, token]
      )

      return { token }
    } catch (error) {
      throw error
    }
  }
}
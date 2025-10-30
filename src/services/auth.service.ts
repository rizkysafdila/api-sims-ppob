import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database'
import { envConfig } from '../config/env'

export class AuthService {
  async register(email: string, password: string, firstName: string, lastName: string) {
    const client = await pool.connect()
    
    try {
      const userCheck = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )

      if (userCheck.rows.length > 0) {
        throw new Error('Email already exists', { cause: 'email.exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await client.query('BEGIN')

      const userResult = await client.query(
        'INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
        [email, hashedPassword]
      )

      const userId = userResult.rows[0].id

      await client.query(
        'INSERT INTO user_profiles (user_id, first_name, last_name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, firstName, lastName]
      )

      await client.query(
        'INSERT INTO balances (user_id, amount, updated_at) VALUES ($1, 0, NOW())',
        [userId]
      )

      await client.query('COMMIT')

      const token = jwt.sign({ userId }, envConfig.JWT_SECRET!, { expiresIn: '7d' })

      return { token, userId }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await pool.query(
        'SELECT id, password FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials')
      }

      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        throw new Error('Invalid credentials')
      }

      const token = jwt.sign({ userId: user.id }, envConfig.JWT_SECRET!, { expiresIn: '7d' })

      await pool.query(
        'INSERT INTO sessions (user_id, token, created_at, expires_at, last_accessed_at) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'7 days\', NOW())',
        [user.id, token]
      )

      return { token, userId: user.id }
    } catch (error) {
      throw error
    }
  }
}
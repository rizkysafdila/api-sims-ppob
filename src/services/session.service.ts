import { pool } from '../config/database'

export class SessionService {
  async getTokenId(token: string) {
    try {
      const result = await pool.query(
        'SELECT id FROM sessions WHERE token = $1',
        [token]
      )

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
}
import { pool } from '../config/database'

export class ProfileService {
  async getProfile(userId: number) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, up.first_name, up.last_name, u.created_at
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [userId]
      )

      if (result.rows.length === 0) {
        throw new Error('Profile not found')
      }

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  async updateProfile(userId: number, firstName: string, lastName: string) {
    try {
      await pool.query(
        'UPDATE user_profiles SET first_name = $1, last_name = $2, updated_at = NOW() WHERE user_id = $3',
        [firstName, lastName, userId]
      )

      return { message: 'Profile updated successfully' }
    } catch (error) {
      throw error
    }
  }

  async updateProfileImage(userId: number, imageUrl: string) {
    try {
      await pool.query(
        'UPDATE user_profiles SET updated_at = NOW() WHERE user_id = $1',
        [userId]
      )

      return { message: 'Profile image updated successfully', imageUrl }
    } catch (error) {
      throw error
    }
  }
}
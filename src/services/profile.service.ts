import { pool } from '../config/database'
import { ProfileValidation } from '../validations/profile.validation'

export class ProfileService {
  async getProfile(user_id: number) {
    try {
      const result = await pool.query(
        `SELECT u.email, up.first_name, up.last_name, up.profile_image
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [user_id]
      )

      if (result.rows.length === 0) {
        throw new Error('Profile not found')
      }

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  async updateProfile(user_id: number, first_name: string, last_name: string) {
    try {
      const validatedData = ProfileValidation.UPDATE.parse({ first_name, last_name })

      await pool.query(
        'UPDATE user_profiles SET first_name = $1, last_name = $2, updated_at = NOW() WHERE user_id = $3',
        [validatedData.first_name, validatedData.last_name, user_id]
      )

      const result = await pool.query(
        `SELECT u.email, up.first_name, up.last_name, up.profile_image
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [user_id]
      )

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  // TODO: profile image validation
  async updateProfileImage(user_id: number, image_url: string) {
    try {
      const validatedData = ProfileValidation.UPDATE_IMAGE.parse({ image_url })

      await pool.query(
        'UPDATE user_profiles SET profile_image = $1, updated_at = NOW() WHERE user_id = $2',
        [validatedData.image_url, user_id]
      )

      const result = await pool.query(
        `SELECT u.email, up.first_name, up.last_name, up.profile_image
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [user_id]
      )

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
}
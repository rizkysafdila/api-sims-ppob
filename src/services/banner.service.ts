import { pool } from '../config/database'

export class BannerService {
  async getAllBanners() {
    try {
      const result = await pool.query(
        'SELECT banner_name, banner_image, description FROM banners ORDER BY id'
      )

      return result.rows
    } catch (error) {
      throw error
    }
  }
}
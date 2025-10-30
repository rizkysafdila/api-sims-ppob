import { pool } from '../config/database'

export class ServiceService {
  async getServices() {
    try {
      const result = await pool.query(
        'SELECT id, service_code, service_name, service_icon, service_tariff FROM services ORDER BY id'
      )

      return result.rows
    } catch (error) {
      throw error
    }
  }

  async getServiceByCode(serviceCode: string) {
    try {
      const result = await pool.query(
        'SELECT id, service_tariff, service_name FROM services WHERE service_code = $1',
        [serviceCode]
      )

      if (result.rows.length === 0) {
        throw new Error('Service not found')
      }

      return result.rows[0]
    } catch (error) {
      throw error
    }
  }
}
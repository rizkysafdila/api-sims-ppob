import { pool } from '../config/database'
import { Service } from '../types/service.type'

export class ServiceService {
  async getAllServices() {
    try {
      const result = await pool.query<Omit<Service, 'id'>>(
        'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id'
      )

      const data = result.rows.map((row) => ({
        ...row,
        service_tariff: Math.trunc(Number(row.service_tariff)),
      }))

      return data
    } catch (error) {
      throw error
    }
  }

  async getServiceByCode(serviceCode: string) {
    try {
      const result = await pool.query<Service>(
        'SELECT id, service_tariff, service_name FROM services WHERE service_code = $1',
        [serviceCode]
      )

      if (result.rows.length === 0) {
        throw new Error('Service atau Layanan tidak ditemukan', { cause: 'no_service' })
      }

      const data = {
        ...result.rows[0],
        service_tariff: Math.trunc(Number(result.rows[0].service_tariff)),
      }

      return data
    } catch (error) {
      throw error
    }
  }
}
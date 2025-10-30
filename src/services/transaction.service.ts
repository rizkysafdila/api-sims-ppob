import { pool } from '../config/database'
import { ServiceService } from './service.service'

export class TransactionService {
  private serviceService = new ServiceService()

  async getBalance(userId: number) {
    try {
      const result = await pool.query(
        'SELECT amount FROM balances WHERE user_id = $1',
        [userId]
      )

      if (result.rows.length === 0) {
        throw new Error('Balance not found')
      }

      return { balance: result.rows[0].amount }
    } catch (error) {
      throw error
    }
  }

  async topUp(userId: number, amount: number) {
    const client = await pool.connect()
    
    try {
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount')
      }

      await client.query('BEGIN')

      const balanceResult = await client.query(
        'UPDATE balances SET amount = amount + $1, updated_at = NOW() WHERE user_id = $2 RETURNING amount',
        [amount, userId]
      )

      const invoiceNumber = `TOP-${Date.now()}-${userId}`
      await client.query(
        `INSERT INTO transactions (service_id, invoice_number, transaction_type, description, total_amount, created_at, updated_at)
         VALUES (NULL, $1, 'TOPUP', 'Top up balance', $2, NOW(), NOW())`,
        [invoiceNumber, amount]
      )

      await client.query('COMMIT')

      return {
        message: 'Top up successful',
        balance: balanceResult.rows[0].amount
      }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async createTransaction(userId: number, serviceCode: string) {
    const client = await pool.connect()
    
    try {
      const service = await this.serviceService.getServiceByCode(serviceCode)

      const balanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1',
        [userId]
      )

      if (balanceResult.rows.length === 0 || balanceResult.rows[0].amount < service.service_tariff) {
        throw new Error('Insufficient balance')
      }

      await client.query('BEGIN')

      await client.query(
        'UPDATE balances SET amount = amount - $1, updated_at = NOW() WHERE user_id = $2',
        [service.service_tariff, userId]
      )

      const invoiceNumber = `TRX-${Date.now()}-${userId}`
      const transactionResult = await client.query(
        `INSERT INTO transactions (service_id, invoice_number, transaction_type, description, total_amount, created_at, updated_at)
         VALUES ($1, $2, 'PAYMENT', $3, $4, NOW(), NOW()) RETURNING *`,
        [service.id, invoiceNumber, `Payment for ${service.service_name}`, service.service_tariff]
      )

      await client.query('COMMIT')

      return {
        message: 'Transaction successful',
        invoice_number: invoiceNumber,
        service_code: serviceCode,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        created_on: transactionResult.rows[0].created_at
      }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async getTransactionHistory(userId: number, limit: number = 10, offset: number = 0) {
    try {
      const result = await pool.query(
        `SELECT t.invoice_number, t.transaction_type, t.description, t.total_amount, t.created_at,
                s.service_code, s.service_name
         FROM transactions t
         LEFT JOIN services s ON t.service_id = s.id
         ORDER BY t.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      )

      return {
        offset,
        limit,
        records: result.rows
      }
    } catch (error) {
      throw error
    }
  }
}
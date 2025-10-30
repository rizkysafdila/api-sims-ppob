import { pool } from '../config/database'
import { QueryParams } from '../types'
import { TransactionValidation } from '../validations/transaction.validation'
import { ServiceService } from './service.service'

export class TransactionService {
  private serviceService = new ServiceService()

  async getBalance(user_id: number) {
    try {
      const result = await pool.query<{ amount: number }>(
        'SELECT amount FROM balances WHERE user_id = $1',
        [user_id]
      )      

      if (result.rows.length === 0) {
        throw new Error('Balance not found')
      }

      const data = { balance: Math.trunc(result.rows[0].amount) }

      return data
    } catch (error) {
      throw error
    }
  }

  async topUp(user_id: number, top_up_amount: number) {
    const client = await pool.connect()
    
    try {
      const validatedData = TransactionValidation.TOPUP.parse({ top_up_amount })

      if (!validatedData.top_up_amount || validatedData.top_up_amount <= 0) {
        throw new Error('Invalid amount')
      }

      await client.query('BEGIN')

      const balanceResult = await client.query(
        'UPDATE balances SET amount = amount + $1, updated_at = NOW() WHERE user_id = $2 RETURNING amount',
        [validatedData.top_up_amount, user_id]
      )

      const invoiceNumber = `TOP-${Date.now()}-${user_id}`
      await client.query(
        `INSERT INTO transactions (service_id, user_id, invoice_number, transaction_type, description, total_amount, created_at, updated_at)
         VALUES (null, $1, $2, 'TOPUP', 'Top up balance', $3, NOW(), NOW())`,
        [user_id, invoiceNumber, validatedData.top_up_amount]
      )

      await client.query('COMMIT')

      return { balance: Math.trunc(balanceResult.rows[0].amount) }
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async createTransaction(user_id: number, service_code: string) {
    const client = await pool.connect()
    
    try {
      const validatedData = TransactionValidation.CREATE_TRANSACTION.parse({ service_code })
      const service = await this.serviceService.getServiceByCode(validatedData.service_code)

      const balanceResult = await client.query(
        'SELECT amount FROM balances WHERE user_id = $1',
        [user_id]
      )

      if (balanceResult.rows.length === 0 || balanceResult.rows[0].amount < service.service_tariff) {
        throw new Error('Saldo tidak mencukupi', { cause: 'insufficient_balance' })
      }

      await client.query('BEGIN')

      await client.query(
        'UPDATE balances SET amount = amount - $1, updated_at = NOW() WHERE user_id = $2',
        [service.service_tariff, user_id]
      )

      const invoiceNumber = `TRX-${Date.now()}-${user_id}`
      const transactionResult = await client.query(
        `INSERT INTO transactions (service_id, user_id, invoice_number, transaction_type, description, total_amount, created_at, updated_at)
         VALUES ($1, $2, $3, 'PAYMENT', $4, $5, NOW(), NOW()) RETURNING *`,
        [service.id, user_id, invoiceNumber, `Payment for ${service.service_name}`, service.service_tariff]
      )

      await client.query('COMMIT')

      return {
        invoice_number: invoiceNumber,
        service_code: validatedData.service_code,
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

  async getTransactionHistory(user_id: number, params: QueryParams) {
    try {
      const result = await pool.query(
        `SELECT t.invoice_number, t.transaction_type, t.description, t.total_amount, t.created_at
         FROM transactions t
         LEFT JOIN services s ON t.service_id = s.id
         WHERE user_id = $1
         ORDER BY t.created_at DESC
         LIMIT $2 OFFSET $3`,
        [user_id, params.limit, params.offset]
      )

      const data = result.rows.map((row) => {
        const { created_at, ...rest } = row

        return {
          ...rest,
          created_on: row.created_at,
          total_amount: Math.trunc(row.total_amount)
        }
      })

      return {
        offset: params.offset,
        limit: params.limit,
        records: data
      }
    } catch (error) {
      throw error
    }
  }
}
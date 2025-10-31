import { Response, NextFunction } from 'express'
import { TransactionService } from '../services/transaction.service'
import { AuthRequest } from '../types/auth.type'
import { errorResponse, successResponse } from '../utils/response'
import { ZodError } from 'zod'

const transactionService = new TransactionService()

export class TransactionController {
  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const balance = await transactionService.getBalance(req.user_id!)
      res.status(200).json(successResponse(0, 'Get Balance Berhasil', balance))
    } catch (error) {
      next(error)
    }
  }

  async topUp(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { top_up_amount } = req.body
      const transaction = await transactionService.topUp(req.user_id!, top_up_amount)
      res.status(200).json(successResponse(0, 'Top Up Balance berhasil', transaction))
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      }

      next(error)
    }
  }

  async createTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { service_code } = req.body
      const transaction = await transactionService.createTransaction(req.user_id!, service_code)
      res.status(200).json(successResponse(0, 'Transaksi Berhasil', transaction))
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json(
          errorResponse(102, error.issues[0].message)
        )
      } else if (error.cause === 'no_service' || error.cause === 'insufficient_balance') {
        return res.status(400).json(
          errorResponse(102, error.message)
        )
      }

      next(error)
    }
  }

  async getTransactionHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { limit = 5, offset = 0 } = req.query
      
      if (isNaN(parseInt(limit as string)) || isNaN(parseInt(offset as string))) {
        return res.status(200).json(successResponse(0, 'Get History Berhasil', []))
      }
      
      const history = await transactionService.getTransactionHistory(
        req.user_id!,
        {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      )
      res.status(200).json(successResponse(0, 'Get History Berhasil', history))
    } catch (error) {
      next(error)
    }
  }
}
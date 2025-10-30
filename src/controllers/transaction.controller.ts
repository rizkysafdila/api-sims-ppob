import { Response, NextFunction } from 'express'
import { TransactionService } from '../services/transaction.service'
import { AuthRequest } from '../types/auth.type'

const transactionService = new TransactionService()

export class TransactionController {
  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const balance = await transactionService.getBalance(req.userId!)
      res.json(balance)
    } catch (error) {
      next(error)
    }
  }

  async topUp(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body
      const result = await transactionService.topUp(req.userId!, amount)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async createTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { service_code } = req.body
      const result = await transactionService.createTransaction(req.userId!, service_code)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getTransactionHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { limit = '10', offset = '0' } = req.query
      const history = await transactionService.getTransactionHistory(
        req.userId!,
        parseInt(limit as string),
        parseInt(offset as string)
      )
      res.json(history)
    } catch (error) {
      next(error)
    }
  }
}
import { Router } from "express"
import authMiddleware from "../middleware/auth"
import { TransactionController } from "../controllers/transaction.controller"

const transactionRouter: Router = Router()
transactionRouter.use(authMiddleware)

const transactionController = new TransactionController()

transactionRouter.get('/balance', transactionController.getBalance);
transactionRouter.post('/topup', transactionController.topUp);
transactionRouter.post('/transaction', transactionController.createTransaction);
transactionRouter.get('/transaction/history', transactionController.getTransactionHistory);

export default transactionRouter

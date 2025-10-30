export interface Transaction {
  id: number
  service_id: number
  invoice_number: string
  transaction_type: 'TOPUP' | 'PAYMENT'
  description: string
  total_amount: number
  created_at: Date
}
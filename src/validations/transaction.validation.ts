import { z } from 'zod';

export class TransactionValidation {
  static readonly TOPUP = z.object({
    top_up_amount: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
      }),
  });

  static readonly CREATE_TRANSACTION = z.object({
    service_code: z.string('Parameter service_code harus di isi'),
  });
}
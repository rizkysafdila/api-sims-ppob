import { z } from 'zod'

export class ProfileValidation {
  static readonly UPDATE = z.object({
    first_name: z.string('Parameter first_name harus di isi').min(1).max(100),
    last_name: z.string('Parameter last_name harus di isi').min(1).max(100),
  })

  static readonly UPDATE_IMAGE = z.object({
    file: z
      .object({
        mimetype: z
          .enum(['image/jpeg', 'image/jpg', 'image/png'], 'Format image tidak sesuai'),
        size: z
          .number()
          .max(2 * 1024 * 1024, 'Ukuran file maksimal 2MB.'),
        buffer: z.any(),
        originalname: z.string().optional(),
      }, 'Field file tidak boleh kosong')
  })
}
import { z } from 'zod';

export class AuthValidation {
  static readonly REGISTER = z.object({
    email: z.email('Parameter email tidak sesuai format'),
    first_name: z.string('Parameter first_name harus di isi').min(1).max(100),
    last_name: z.string('Parameter last_name harus di isi').min(1).max(100),
    password: z.string('Parameter password harus di isi').min(8, 'Password length minimal 8 karakter'),
  });

  static readonly LOGIN = z.object({
    email: z.email('Parameter email tidak sesuai format'),
    password: z.string('Parameter password harus di isi'),
  });
}
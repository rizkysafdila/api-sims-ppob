import { z } from 'zod';

export class ProfileValidation {
  static readonly UPDATE = z.object({
    first_name: z.string('Parameter first_name harus di isi').min(1).max(100),
    last_name: z.string('Parameter last_name harus di isi').min(1).max(100),
  });

  // TODO: profile image validation
  static readonly UPDATE_IMAGE = z.object({
    image_url: z.string().url('Invalid image URL').optional(),
  });
}
import multer, { FileFilterCallback } from 'multer'

const storage = multer.memoryStorage()

// NOTE: can use this to validate on middleware level for better performance? 
const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format image tidak sesuai', { cause: 'invalid_type' }))
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})
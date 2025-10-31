import { v2 as cloudinary } from 'cloudinary'
import { envConfig } from './env'
import logger from './logger'

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'profile_images'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error)
          reject(error)
        } else {
          resolve(result!.secure_url)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

export default cloudinary
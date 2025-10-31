import { config } from 'dotenv'
import fs from 'fs'
import logger from './logger'

interface EnvConfig {
  APP_NAME?: string
  APP_URL?: string
  APP_PORT?: string
  DATABASE_URL?: string
  DATABASE_HOST?: string
  DATABASE_PORT?: string
  DATABASE_USERNAME?: string
  DATABASE_PASSWORD?: string
  DATABASE_NAME?: string
  JWT_SECRET?: string
}

const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`

if (fs.existsSync(envFile)) {
  config({ path: envFile })
} else {
  logger.warn(
    `⚠️  Environment file ${envFile} not found. Make sure to run configureEnvironment.`,
  )
}

export const envConfig: EnvConfig = ({
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
  APP_PORT: process.env.APP_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
} = process.env as EnvConfig)

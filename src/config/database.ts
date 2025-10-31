import { Pool } from 'pg';
import { envConfig } from './env';
import logger from './logger';

const poolConfig = envConfig.DATABASE_URL
  ? {
      connectionString: envConfig.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: envConfig.DATABASE_HOST,
      port: parseInt(envConfig.DATABASE_PORT!),
      database: envConfig.DATABASE_NAME,
      user: envConfig.DATABASE_USERNAME,
      password: envConfig.DATABASE_PASSWORD,
    };

export const pool = new Pool(poolConfig);

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('✅ Database connected successfully');
    client.release();
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
});
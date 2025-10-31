import { Pool } from 'pg';
import { envConfig } from './env';
import logger from './logger';

const poolConfig = process.env.NODE_ENV === 'production'
  ? {
      connectionString: envConfig.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      // Critical for serverless: limit connections
      max: 1, // Use only 1 connection per function
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    }
  : {
      host: envConfig.DATABASE_HOST,
      port: parseInt(envConfig.DATABASE_PORT!),
      database: envConfig.DATABASE_NAME,
      user: envConfig.DATABASE_USERNAME,
      password: envConfig.DATABASE_PASSWORD,
      max: 10, // For local development
    };

export const pool = new Pool(poolConfig);

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info('✅ Database connected successfully');
    client.release();
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    // Don't exit in production (serverless)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
});

// Graceful shutdown for serverless
process.on('SIGTERM', async () => {
  await pool.end();
});
import morgan, { StreamOptions } from 'morgan'
import logger from '../config/logger'

const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
}

const morganMiddleware = morgan('dev', { stream })

export default morganMiddleware
import morgan from 'morgan';
import env from './env.js';

import winstonLogger from '../utils/logger.js';

const format = env.NODE_ENV === 'production' ? 'combined' : 'dev';

// Redirect Morgan HTTP request logs to Winston
const stream = {
  write: (message) => winstonLogger.info(message.trim()),
};

export const loggerMiddleware = morgan(format, { stream });

export const logger = {
  info: (...args) => winstonLogger.info(args.join(' ')),
  warn: (...args) => winstonLogger.warn(args.join(' ')),
  error: (...args) => winstonLogger.error(args.join(' ')),
  debug: (...args) => {
    if (env.NODE_ENV !== 'production') {
      winstonLogger.debug(args.join(' '));
    }
  },
};

export default loggerMiddleware;

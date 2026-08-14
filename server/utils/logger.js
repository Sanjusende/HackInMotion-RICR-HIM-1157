import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
  filename: 'logs/krishimitra-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
});

const logger = winston.createLogger({
  level: 'info',
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

export default logger;

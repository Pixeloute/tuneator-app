import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino/file',
    options: { destination: './logs/app.log' }
  }
});

export class LoggingService {
  info(msg: string, data?: any) {
    logger.info(data || {}, msg);
  }
  error(msg: string, data?: any) {
    logger.error(data || {}, msg);
  }
  warn(msg: string, data?: any) {
    logger.warn(data || {}, msg);
  }
} 
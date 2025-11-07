import winston from 'winston';
import { query } from '../config/database';

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Database logger - saves logs to database
export const logToDatabase = async (
  level: 'info' | 'warning' | 'error' | 'critical',
  module: string,
  message: string,
  metadata?: any
) => {
  try {
    await query(
      `INSERT INTO system_logs (level, module, message, metadata)
       VALUES ($1, $2, $3, $4)`,
      [level, module, message, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (error) {
    logger.error('Failed to log to database:', error);
  }
};

// Combined logger
export const log = {
  info: (module: string, message: string, metadata?: any) => {
    logger.info(`[${module}] ${message}`, metadata);
    logToDatabase('info', module, message, metadata);
  },
  warning: (module: string, message: string, metadata?: any) => {
    logger.warn(`[${module}] ${message}`, metadata);
    logToDatabase('warning', module, message, metadata);
  },
  error: (module: string, message: string, metadata?: any) => {
    logger.error(`[${module}] ${message}`, metadata);
    logToDatabase('error', module, message, metadata);
  },
  critical: (module: string, message: string, metadata?: any) => {
    logger.error(`[${module}] CRITICAL: ${message}`, metadata);
    logToDatabase('critical', module, message, metadata);
  },
};

export default logger;

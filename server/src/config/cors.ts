import { CorsOptions } from 'cors';
import { AppError } from '../middleware/error-handler';
import { env } from './env';

export const allowedOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function isOriginAllowed(origin?: string) {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(origin);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError(403, 'Origin is not allowed by CORS'));
  }
};

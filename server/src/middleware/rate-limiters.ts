import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

const rateLimitResponse = {
  message: 'Too many requests. Please try again later.'
};

type RateLimiterOptions = {
  windowMs: number;
  limit: number;
  message: {
    message: string;
  };
};

export function createRateLimiter({ windowMs, limit, message }: RateLimiterOptions) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message
  });
}

export const globalApiRateLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  message: rateLimitResponse
});

export const createOrderRateLimiter = createRateLimiter({
  windowMs: env.ORDER_CREATE_RATE_LIMIT_WINDOW_MS,
  limit: env.ORDER_CREATE_RATE_LIMIT_MAX_REQUESTS,
  message: {
    message: 'Too many order attempts. Please try again later.'
  }
});

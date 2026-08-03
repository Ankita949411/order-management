import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://postgres:postgres@localhost:5432/order_management?schema=public'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  ORDER_STATUS_UPDATE_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(300),
  ORDER_CREATE_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  ORDER_CREATE_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(20)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;

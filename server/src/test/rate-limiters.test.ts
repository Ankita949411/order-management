import express from 'express';
import request from 'supertest';
import { createRateLimiter } from '../middleware/rate-limiters';

describe('rate limiters', () => {
  it('returns JSON 429 responses for global API limits', async () => {
    const app = express();
    app.use(
      createRateLimiter({
        windowMs: 60_000,
        limit: 2,
        message: {
          message: 'Too many requests. Please try again later.'
        }
      }),
      (_req, res) => {
        res.status(200).json({ ok: true });
      }
    );

    await request(app).get('/api/menu').expect(200);
    await request(app).get('/api/menu').expect(200);

    const response = await request(app).get('/api/menu');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many requests. Please try again later.'
    });
  });

  it('returns JSON 429 responses for order creation limits', async () => {
    const app = express();
    app.use(
      createRateLimiter({
        windowMs: 60_000,
        limit: 1,
        message: {
          message: 'Too many order attempts. Please try again later.'
        }
      }),
      (_req, res) => {
        res.status(201).json({ ok: true });
      }
    );

    await request(app).post('/api/orders').expect(201);

    const response = await request(app).post('/api/orders');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many order attempts. Please try again later.'
    });
  });
});

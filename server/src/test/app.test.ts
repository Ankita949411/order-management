import request from 'supertest';
import { createApp } from '../app';

describe('app setup', () => {
  it('returns the health status', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

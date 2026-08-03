import request from 'supertest';
import { createApp } from '../app';

describe('CORS allowlist', () => {
  it('allows configured origins', async () => {
    const response = await request(createApp())
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('rejects unknown origins', async () => {
    const response = await request(createApp())
      .get('/api/health')
      .set('Origin', 'https://unknown.example.com');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Origin is not allowed by CORS'
    });
  });
});

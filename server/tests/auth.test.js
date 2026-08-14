import request from 'supertest';
import app from '../app.js';

describe('Authentication API Integrity', () => {
  it('should reject registration requests with missing parameters', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: 'farmer@test.com' });
    expect(res.statusCode).toBe(400);
  });
});

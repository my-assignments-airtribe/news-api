import request from 'supertest';
import express from 'express';
import { limiter } from '../../services/rateLimiter';

const app = express();
app.use(limiter);

describe('rateLimiter middleware', () => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
  });
  it('should allow requests within the rate limit', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should reject requests beyond the rate limit', async () => {
    // Send 11 requests within 1 minute
    for (let i = 0; i < 101; i++) {
      await request(app).get('/');
    }

    const response = await request(app).get('/');
    expect(response.status).toBe(429);
    expect(response.text).toBe('Rate limit exceeded. Please try again later.');
  });
});
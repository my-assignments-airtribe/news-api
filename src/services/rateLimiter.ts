import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 10 requests per minute
  message: 'Rate limit exceeded. Please try again later.',
});
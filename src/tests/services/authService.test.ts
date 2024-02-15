import { generateToken, verifyToken } from '../../services/authService';

describe('Auth Service', () => {
  const user = {
    _id: 'user-id',
    username: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password'
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(user._id);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid JWT token', () => {
      const token = generateToken(user._id);
      const decodedToken = verifyToken(token);
      expect(decodedToken).toBeDefined();
      expect(decodedToken?.userId).toEqual(user._id);
    });

    it('should return null for an invalid JWT token', () => {
      const invalidToken = 'invalid-token';
      const decodedToken = verifyToken(invalidToken);
      expect(decodedToken).toBeNull();
    });
  });
});
import { ValidationError, AuthenticationError, AuthorizationError, UsernameTakenError, BadRequestError } from '../../utils/error-types';

describe('Error Types', () => {
  describe('ValidationError', () => {
    it('should create a new instance of ValidationError', () => {
      const error = new ValidationError('Validation error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('Validation error message');
    });
  });

  describe('AuthenticationError', () => {
    it('should create a new instance of AuthenticationError', () => {
      const error = new AuthenticationError('Authentication error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toEqual('AuthenticationError');
      expect(error.message).toEqual('Authentication error message');
    });
  });

  describe('AuthorizationError', () => {
    it('should create a new instance of AuthorizationError', () => {
      const error = new AuthorizationError('Authorization error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.name).toEqual('AuthorizationError');
      expect(error.message).toEqual('Authorization error message');
    });
  });

  describe('UsernameTakenError', () => {
    it('should create a new instance of UsernameTakenError', () => {
      const error = new UsernameTakenError('Username taken error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UsernameTakenError);
      expect(error.name).toEqual('UsernameTakenError');
      expect(error.message).toEqual('Username taken error message');
    });
  });

  describe('BadRequestError', () => {
    it('should create a new instance of BadRequestError', () => {
      const error = new BadRequestError('Bad request error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.name).toEqual('BadRequestError');
      expect(error.message).toEqual('Bad request error message');
    });
  });
});
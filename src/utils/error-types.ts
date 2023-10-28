class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class UsernameTakenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsernameTakenError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { ValidationError, AuthenticationError, AuthorizationError, UsernameTakenError, BadRequestError };
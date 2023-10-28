import { registrationSchema, loginSchema, preferencesSchema, removePreferencesSchema } from '../../validation/userValidation';

describe('User Validation', () => {
  describe('registrationSchema', () => {
    it('should validate a valid registration object', () => {
      const validRegistration = {
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com'
      };
      const { error } = registrationSchema.validate(validRegistration);
      expect(error).toBeUndefined();
    });

    it('should not validate a registration object with an invalid email', () => {
      const invalidRegistration = {
        username: 'testuser',
        password: 'testpassword',
        email: 'invalidemail'
      };
      const { error } = registrationSchema.validate(invalidRegistration);
      expect(error).toBeDefined();
    });

    it('should not validate a registration object with a short password', () => {
      const invalidRegistration = {
        username: 'testuser',
        password: 'short',
        email: 'testuser@example.com'
      };
      const { error } = registrationSchema.validate(invalidRegistration);
      expect(error).toBeDefined();
    });

    it('should not validate a registration object with a short username', () => {
      const invalidRegistration = {
        username: 'a',
        password: 'testpassword',
        email: 'testuser@example.com'
      };
      const { error } = registrationSchema.validate(invalidRegistration);
      expect(error).toBeDefined();
    });
  });

  describe('loginSchema', () => {
    it('should validate a valid login object', () => {
      const validLogin = {
        username: 'testuser',
        password: 'testpassword'
      };
      const { error } = loginSchema.validate(validLogin);
      expect(error).toBeUndefined();
    });

    it('should not validate a login object without a password', () => {
      const invalidLogin = {
        username: 'testuser'
      };
      const { error } = loginSchema.validate(invalidLogin);
      expect(error).toBeDefined();
    });

    it('should not validate a login object without a username', () => {
      const invalidLogin = {
        password: 'testpassword'
      };
      const { error } = loginSchema.validate(invalidLogin);
      expect(error).toBeDefined();
    });
  });

  describe('preferencesSchema', () => {
    it('should validate a valid preferences object', () => {
      const validPreferences = {
        categories: ['sports', 'politics'],
        sources: ['cnn', 'bbc']
      };
      const { error } = preferencesSchema.validate(validPreferences);
      expect(error).toBeUndefined();
    });

    it('should validate a preferences object with empty arrays', () => {
      const validPreferences = {
        categories: [],
        sources: []
      };
      const { error } = preferencesSchema.validate(validPreferences);
      expect(error).toBeUndefined();
    });

    it('should not validate a preferences object with invalid categories', () => {
      const invalidPreferences = {
        categories: ['sports', 123],
        sources: ['cnn', 'bbc']
      };
      const { error } = preferencesSchema.validate(invalidPreferences);
      expect(error).toBeDefined();
    });

    it('should not validate a preferences object with invalid sources', () => {
      const invalidPreferences = {
        categories: ['sports', 'politics'],
        sources: ['cnn', 123]
      };
      const { error } = preferencesSchema.validate(invalidPreferences);
      expect(error).toBeDefined();
    });
  });

  describe('removePreferencesSchema', () => {
    it('should validate a valid remove preferences object', () => {
      const validRemovePreferences = {
        removeCategories: ['sports', 'politics'],
        removeSources: ['cnn', 'bbc']
      };
      const { error } = removePreferencesSchema.validate(validRemovePreferences);
      expect(error).toBeUndefined();
    });

    it('should validate a remove preferences object with empty arrays', () => {
      const validRemovePreferences = {
        removeCategories: [],
        removeSources: []
      };
      const { error } = removePreferencesSchema.validate(validRemovePreferences);
      expect(error).toBeUndefined();
    });

    it('should not validate a remove preferences object with invalid categories', () => {
      const invalidRemovePreferences = {
        removeCategories: ['sports', 123],
        removeSources: ['cnn', 'bbc']
      };
      const { error } = removePreferencesSchema.validate(invalidRemovePreferences);
      expect(error).toBeDefined();
    });

    it('should not validate a remove preferences object with invalid sources', () => {
      const invalidRemovePreferences = {
        removeCategories: ['sports', 'politics'],
        removeSources: ['cnn', 123]
      };
      const { error } = removePreferencesSchema.validate(invalidRemovePreferences);
      expect(error).toBeDefined();
    });
  });
});
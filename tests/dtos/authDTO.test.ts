import { AuthRegisterUserDTO, AuthLoginDTO, AuthLinkUserToMarketDTO, AuthCreateMarketDTO } from '../../src/dtos/authDTO';

describe('Auth DTOs', () => {
  describe('AuthRegisterUserDTO', () => {
    it('should validate correct user registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        marketId: 'market-123'
      };

      const result = AuthRegisterUserDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should validate user registration data without marketId', () => {
      const validData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      const result = AuthRegisterUserDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should throw error when name is missing', () => {
      const invalidData = {
        email: 'john@example.com',
        password: 'password123'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when name is empty string', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        password: 'password123'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when email is missing', () => {
      const invalidData = {
        name: 'John Doe',
        password: 'password123'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when email is invalid', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when password is missing', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when password is too short', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345'
      };

      expect(() => AuthRegisterUserDTO.parse(invalidData)).toThrow();
    });

    it('should accept valid marketId', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        marketId: 'valid-market-id-123'
      };

      const result = AuthRegisterUserDTO.parse(validData);

      expect(result.marketId).toBe('valid-market-id-123');
    });
  });

  describe('AuthLoginDTO', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const result = AuthLoginDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should throw error when email is missing', () => {
      const invalidData = {
        password: 'password123'
      };

      expect(() => AuthLoginDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when email is invalid', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      expect(() => AuthLoginDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when password is missing', () => {
      const invalidData = {
        email: 'john@example.com'
      };

      expect(() => AuthLoginDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when password is empty string', () => {
      const invalidData = {
        email: 'john@example.com',
        password: ''
      };

      expect(() => AuthLoginDTO.parse(invalidData)).toThrow();
    });
  });

  describe('AuthLinkUserToMarketDTO', () => {
    it('should validate correct link data', () => {
      const validData = {
        userId: 'user-123',
        marketId: 'market-123'
      };

      const result = AuthLinkUserToMarketDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should throw error when userId is missing', () => {
      const invalidData = {
        marketId: 'market-123'
      };

      expect(() => AuthLinkUserToMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when userId is empty string', () => {
      const invalidData = {
        userId: '',
        marketId: 'market-123'
      };

      expect(() => AuthLinkUserToMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when marketId is missing', () => {
      const invalidData = {
        userId: 'user-123'
      };

      expect(() => AuthLinkUserToMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when marketId is empty string', () => {
      const invalidData = {
        userId: 'user-123',
        marketId: ''
      };

      expect(() => AuthLinkUserToMarketDTO.parse(invalidData)).toThrow();
    });
  });

  describe('AuthCreateMarketDTO', () => {
    it('should validate correct market creation data', () => {
      const validData = {
        name: 'Super Market',
        address: '123 Main Street',
        profilePicture: 'https://example.com/image.jpg'
      };

      const result = AuthCreateMarketDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should validate market creation data without profilePicture', () => {
      const validData = {
        name: 'Super Market',
        address: '123 Main Street'
      };

      const result = AuthCreateMarketDTO.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should throw error when name is missing', () => {
      const invalidData = {
        address: '123 Main Street'
      };

      expect(() => AuthCreateMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when name is empty string', () => {
      const invalidData = {
        name: '',
        address: '123 Main Street'
      };

      expect(() => AuthCreateMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when address is missing', () => {
      const invalidData = {
        name: 'Super Market'
      };

      expect(() => AuthCreateMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when address is empty string', () => {
      const invalidData = {
        name: 'Super Market',
        address: ''
      };

      expect(() => AuthCreateMarketDTO.parse(invalidData)).toThrow();
    });

    it('should throw error when profilePicture is invalid URL', () => {
      const invalidData = {
        name: 'Super Market',
        address: '123 Main Street',
        profilePicture: 'not-a-valid-url'
      };

      expect(() => AuthCreateMarketDTO.parse(invalidData)).toThrow();
    });

    it('should accept valid profilePicture URL', () => {
      const validData = {
        name: 'Super Market',
        address: '123 Main Street',
        profilePicture: 'https://example.com/valid-image.jpg'
      };

      const result = AuthCreateMarketDTO.parse(validData);

      expect(result.profilePicture).toBe('https://example.com/valid-image.jpg');
    });
  });
});
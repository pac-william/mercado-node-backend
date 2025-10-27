import { userRepository } from '../../src/repositories/userRepository';
import { prisma } from '../../src/utils/prisma';
import { UserDTO, UserUpdateDTO } from '../../src/dtos/userDTO';

// Mock Prisma client - use jest.mocked for proper typing
const mockedPrisma = jest.mocked(prisma, { shallow: false });

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange: Setup test data and mocks
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.create.mockResolvedValue(mockUser);

      // Act: Call the repository method
      const result = await userRepository.createUser(userData);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: userData
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle Prisma errors during user creation', async () => {
      // Arrange: Setup test data and mock Prisma to throw error
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      const prismaError = new Error('Database connection failed');
      mockedPrisma.user.create.mockRejectedValue(prismaError);

      // Act & Assert: Verify that error is propagated
      await expect(userRepository.createUser(userData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUsers', () => {
    it('should get users with pagination', async () => {
      // Arrange: Setup test data and mocks
      const page = 1;
      const size = 10;

      const mockUsers = [
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
          role: 'CUSTOMER' as const,
          marketId: null,
          refreshToken: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user-2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'hashedPassword',
          role: 'CUSTOMER' as const,
          marketId: null,
          refreshToken: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockedPrisma.user.findMany.mockResolvedValue(mockUsers);

      // Act: Call the repository method
      const result = await userRepository.getUsers(page, size);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * size,
        take: size,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUsers);
    });

    it('should handle different page and size values', async () => {
      // Arrange: Setup test data and mocks
      const page = 3;
      const size = 5;

      const mockUsers = [
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
          role: 'CUSTOMER' as const,
          marketId: null,
          refreshToken: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockedPrisma.user.findMany.mockResolvedValue(mockUsers);

      // Act: Call the repository method
      const result = await userRepository.getUsers(page, size);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * size, // (3 - 1) * 5 = 10
        take: size,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users found', async () => {
      // Arrange: Setup test data and mocks
      const page = 1;
      const size = 10;

      mockedPrisma.user.findMany.mockResolvedValue([]);

      // Act: Call the repository method
      const result = await userRepository.getUsers(page, size);

      // Assert: Verify the result and calls
      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'user-123';

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act: Call the repository method
      const result = await userRepository.getUserById(userId);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'non-existent-user';

      mockedPrisma.user.findUnique.mockResolvedValue(null);

      // Act: Call the repository method
      const result = await userRepository.getUserById(userId);

      // Assert: Verify the result and calls
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should get user by email successfully', async () => {
      // Arrange: Setup test data and mocks
      const email = 'john@example.com';

      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshToken: null
      };

      mockedPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Act: Call the repository method
      const result = await userRepository.getUserByEmail(email);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      // Arrange: Setup test data and mocks
      const email = 'nonexistent@example.com';

      mockedPrisma.user.findUnique.mockResolvedValue(null);

      // Act: Call the repository method
      const result = await userRepository.getUserByEmail(email);

      // Assert: Verify the result and calls
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'user-123';
      const userData: UserDTO = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        password: 'newHashedPassword'
      };

      const mockUpdatedUser = {
        id: 'user-123',
        name: 'John Updated',
        email: 'john.updated@example.com',
        password: 'newHashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act: Call the repository method
      const result = await userRepository.updateUser(userId, userData);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle Prisma errors during user update', async () => {
      // Arrange: Setup test data and mock Prisma to throw error
      const userId = 'user-123';
      const userData: UserDTO = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        password: 'newHashedPassword'
      };

      const prismaError = new Error('User not found');
      mockedPrisma.user.update.mockRejectedValue(prismaError);

      // Act & Assert: Verify that error is propagated
      await expect(userRepository.updateUser(userId, userData)).rejects.toThrow('User not found');
    });
  });

  describe('updateUserPartial', () => {
    it('should update user partially successfully', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'user-123';
      const userUpdateData: UserUpdateDTO = {
        name: 'John Partially Updated',
        email: 'john.partial@example.com'
      };

      const mockUpdatedUser = {
        id: 'user-123',
        name: 'John Partially Updated',
        email: 'john.partial@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act: Call the repository method
      const result = await userRepository.updateUserPartial(userId, userUpdateData);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: userUpdateData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle partial update with only name', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'user-123';
      const userUpdateData: UserUpdateDTO = {
        name: 'John Name Only Updated'
      };

      const mockUpdatedUser = {
        id: 'user-123',
        name: 'John Name Only Updated',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act: Call the repository method
      const result = await userRepository.updateUserPartial(userId, userUpdateData);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: userUpdateData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange: Setup test data and mocks
      const userId = 'user-123';

      const mockDeletedUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER' as const,
        marketId: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedPrisma.user.delete.mockResolvedValue(mockDeletedUser);

      // Act: Call the repository method
      const result = await userRepository.deleteUser(userId);

      // Assert: Verify the result and calls
      expect(mockedPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(mockDeletedUser);
    });

    it('should handle Prisma errors during user deletion', async () => {
      // Arrange: Setup test data and mock Prisma to throw error
      const userId = 'non-existent-user';

      const prismaError = new Error('User not found');
      mockedPrisma.user.delete.mockRejectedValue(prismaError);

      // Act & Assert: Verify that error is propagated
      await expect(userRepository.deleteUser(userId)).rejects.toThrow('User not found');
    });
  });
});

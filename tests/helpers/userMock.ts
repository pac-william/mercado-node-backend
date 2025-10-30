import { User } from '@prisma/client';

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    auth0Id: null,
    phone: null,
    profilePicture: null,
    birthDate: null,
    gender: null,
    address: null,
    refreshToken: null,
    role: 'CUSTOMER' as const,
    marketId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

export function createMockUserArray(count: number, overrides?: Partial<User>): User[] {
  return Array.from({ length: count }, (_, index) => 
    createMockUser({ 
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
      ...overrides 
    })
  );
}


import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../../../../src/infrastructure/persistence/prisma/prisma-user.repository';
import { User } from '../../../../src/core/domain/user/user.entity';

// Mock PrismaClient
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient; 

describe('PrismaUserRepository', () => {
  let userRepository: PrismaUserRepository;

  beforeEach(() => {
    userRepository = new PrismaUserRepository(mockPrisma);
    jest.clearAllMocks();
  });

  it('should find a user by ID', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.findById('1');
    expect(result).toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find a user by email', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.findByEmail('test@example.com');
    expect(result).toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should find a user by username', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.findByUsername('testuser');
    expect(result).toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
  });

  it('should create a new user', async () => {
    const newUserInput = {
      email: 'new@example.com',
      password: 'hashedpassword',
      username: 'newuser',
    };
    const createdUser: User = {
      id: '2',
      ...newUserInput,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.user.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await userRepository.create(newUserInput);
    expect(result).toEqual(createdUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: newUserInput });
  });

  it('should update a user', async () => {
    const existingUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates = { username: 'updateduser' };
    const updatedUser: User = { ...existingUser, ...updates };
    (mockPrisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await userRepository.update('1', updates);
    expect(result).toEqual(updatedUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updates });
  });

  it('should delete a user', async () => {
    (mockPrisma.user.delete as jest.Mock).mockResolvedValue(undefined);

    await userRepository.delete('1');
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});

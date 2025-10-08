import { UserService } from '../../../../src/core/application/user/user.service';
import { UserRepository } from '../../../../src/core/application/user/user.repository';
import { User } from '../../../../src/core/domain/user/user.entity';
import bcrypt from 'bcrypt';
import * as jwt from '../../../../src/utils/jwt';

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('utils/jwt');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAllUsers: jest.fn(),
    };
    userService = new UserService(mockUserRepository);
  });

  it('should get all users', async () => {
    const users: User[] = [
      {
        id: '1',
        email: 'test1@example.com',
        username: 'testuser1',
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'test2@example.com',
        username: 'testuser2',
        points: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockUserRepository.getAllUsers.mockResolvedValue(users);

    const result = await userService.getAllUsers();
    expect(result).toEqual(users);
    expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
  });

  it('should get a user by ID', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await userService.getUserById('1');
    expect(result).toEqual(user);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should create a new user and hash the password', async () => {
    const newUserInput = {
      email: 'new@example.com',
      password: 'password123',
      username: 'newuser',
    };
    const hashedPassword = 'hashedpassword';
    const createdUser: User = {
      id: '2',
      ...newUserInput,
      password: hashedPassword,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(newUserInput);
    expect(result).toEqual(createdUser);
    expect(bcrypt.hash).toHaveBeenCalledWith(newUserInput.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...newUserInput,
      password: hashedPassword,
    });
  });

  it('should log in a user with correct credentials', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const token = 'mocktoken';

    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.generateToken as jest.Mock).mockReturnValue(token);

    const result = await userService.login('test@example.com', 'password123');
    expect(result).toEqual({ user, token });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    expect(jwt.generateToken).toHaveBeenCalledWith({ id: user.id, email: user.email });
  });

  it('should not log in a user with incorrect password', async () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await userService.login('test@example.com', 'wrongpassword');
    expect(result).toBeNull();
  });

  it('should update a user', async () => {
    const existingUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'oldpassword',
      username: 'testuser',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates = { username: 'updateduser' };
    const updatedUser: User = { ...existingUser, ...updates };

    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await userService.updateUser('1', updates);
    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith('1', updates);
  });

  it('should delete a user', async () => {
    mockUserRepository.delete.mockResolvedValue(undefined);

    await userService.deleteUser('1');
    expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
  });
});

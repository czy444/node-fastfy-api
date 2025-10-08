import { PrismaClient } from '@prisma/client';
import { PrismaHabitRepository } from '../../../../src/infrastructure/persistence/prisma/prisma-habit.repository';
import { Habit } from '../../../../src/core/domain/habit/habit.entity';

// Mock PrismaClient
const mockPrisma = {
  habit: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

describe('PrismaHabitRepository', () => {
  let habitRepository: PrismaHabitRepository;

  beforeEach(() => {
    habitRepository = new PrismaHabitRepository(mockPrisma);
    jest.clearAllMocks();
  });

  it('should find a habit by ID', async () => {
    const habit: Habit = {
      id: '1',
      name: 'Recycle Plastic',
      description: 'Recycle all plastic waste',
      points: 10,
      category: 'Recycling',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.habit.findUnique as jest.Mock).mockResolvedValue(habit);

    const result = await habitRepository.findById('1');
    expect(result).toEqual(habit);
    expect(mockPrisma.habit.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find habits by user ID', async () => {
    const habits: Habit[] = [
      {
        id: '1',
        name: 'Recycle Plastic',
        description: 'Recycle all plastic waste',
        points: 10,
        category: 'Recycling',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Use Public Transport',
        description: 'Use bus or train instead of car',
        points: 15,
        category: 'Transport',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (mockPrisma.habit.findMany as jest.Mock).mockResolvedValue(habits);

    const result = await habitRepository.findByUserId('user1');
    expect(result).toEqual(habits);
    expect(mockPrisma.habit.findMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
  });

  it('should create a new habit', async () => {
    const newHabitInput = {
      name: 'Save Water',
      description: 'Take shorter showers',
      points: 5,
      category: 'Water Saving',
      userId: 'user1',
    };
    const createdHabit: Habit = {
      id: '3',
      ...newHabitInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.habit.create as jest.Mock).mockResolvedValue(createdHabit);

    const result = await habitRepository.create(newHabitInput);
    expect(result).toEqual(createdHabit);
    expect(mockPrisma.habit.create).toHaveBeenCalledWith({ data: newHabitInput });
  });

  it('should update a habit', async () => {
    const existingHabit: Habit = {
      id: '1',
      name: 'Recycle Plastic',
      description: 'Recycle all plastic waste',
      points: 10,
      category: 'Recycling',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates = { points: 12, description: 'Recycle all plastic and glass waste' };
    const updatedHabit: Habit = { ...existingHabit, ...updates };
    (mockPrisma.habit.update as jest.Mock).mockResolvedValue(updatedHabit);

    const result = await habitRepository.update('1', updates);
    expect(result).toEqual(updatedHabit);
    expect(mockPrisma.habit.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updates });
  });

  it('should delete a habit', async () => {
    (mockPrisma.habit.delete as jest.Mock).mockResolvedValue(undefined);

    await habitRepository.delete('1');
    expect(mockPrisma.habit.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});

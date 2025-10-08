import { PrismaClient } from '@prisma/client';
import { PrismaHabitLogRepository } from '../../../../src/infrastructure/persistence/prisma/prisma-habit-log.repository';
import { HabitLog } from '../../../../src/core/domain/habit/habit-log.entity';

// Mock PrismaClient
const mockPrisma = {
  habitLog: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

describe('PrismaHabitLogRepository', () => {
  let habitLogRepository: PrismaHabitLogRepository;

  beforeEach(() => {
    habitLogRepository = new PrismaHabitLogRepository(mockPrisma);
    jest.clearAllMocks();
  });

  it('should find a habit log by ID', async () => {
    const habitLog: HabitLog = {
      id: '1',
      habitId: 'habit1',
      date: new Date(),
      pointsEarned: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.habitLog.findUnique as jest.Mock).mockResolvedValue(habitLog);

    const result = await habitLogRepository.findById('1');
    expect(result).toEqual(habitLog);
    expect(mockPrisma.habitLog.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find habit logs by habit ID', async () => {
    const habitLogs: HabitLog[] = [
      {
        id: '1',
        habitId: 'habit1',
        date: new Date(),
        pointsEarned: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        habitId: 'habit1',
        date: new Date(),
        pointsEarned: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (mockPrisma.habitLog.findMany as jest.Mock).mockResolvedValue(habitLogs);

    const result = await habitLogRepository.findByHabitId('habit1');
    expect(result).toEqual(habitLogs);
    expect(mockPrisma.habitLog.findMany).toHaveBeenCalledWith({ where: { habitId: 'habit1' } });
  });

  it('should create a new habit log', async () => {
    const newHabitLogInput = {
      habitId: 'habit2',
      date: new Date(),
      pointsEarned: 5,
    };
    const createdHabitLog: HabitLog = {
      id: '3',
      ...newHabitLogInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (mockPrisma.habitLog.create as jest.Mock).mockResolvedValue(createdHabitLog);

    const result = await habitLogRepository.create(newHabitLogInput);
    expect(result).toEqual(createdHabitLog);
    expect(mockPrisma.habitLog.create).toHaveBeenCalledWith({ data: newHabitLogInput });
  });

  it('should update a habit log', async () => {
    const existingHabitLog: HabitLog = {
      id: '1',
      habitId: 'habit1',
      date: new Date(),
      pointsEarned: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates = { pointsEarned: 12 };
    const updatedHabitLog: HabitLog = { ...existingHabitLog, ...updates };
    (mockPrisma.habitLog.update as jest.Mock).mockResolvedValue(updatedHabitLog);

    const result = await habitLogRepository.update('1', updates);
    expect(result).toEqual(updatedHabitLog);
    expect(mockPrisma.habitLog.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updates });
  });

  it('should delete a habit log', async () => {
    (mockPrisma.habitLog.delete as jest.Mock).mockResolvedValue(undefined);

    await habitLogRepository.delete('1');
    expect(mockPrisma.habitLog.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});

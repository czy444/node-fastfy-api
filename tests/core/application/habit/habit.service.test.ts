import { HabitService } from '../../../../src/core/application/habit/habit.service';
import { HabitRepository } from '../../../../src/core/application/habit/habit.repository';
import { Habit } from '../../../../src/core/domain/habit/habit.entity';

describe('HabitService', () => {
  let habitService: HabitService;
  let mockHabitRepository: jest.Mocked<HabitRepository>;

  beforeEach(() => {
    mockHabitRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    habitService = new HabitService(mockHabitRepository);
  });

  it('should get a habit by ID', async () => {
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
    mockHabitRepository.findById.mockResolvedValue(habit);

    const result = await habitService.getHabitById('1');
    expect(result).toEqual(habit);
    expect(mockHabitRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should get habits by user ID', async () => {
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
    mockHabitRepository.findByUserId.mockResolvedValue(habits);

    const result = await habitService.getHabitsByUserId('user1');
    expect(result).toEqual(habits);
    expect(mockHabitRepository.findByUserId).toHaveBeenCalledWith('user1');
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

    mockHabitRepository.create.mockResolvedValue(createdHabit);

    const result = await habitService.createHabit(newHabitInput);
    expect(result).toEqual(createdHabit);
    expect(mockHabitRepository.create).toHaveBeenCalledWith(newHabitInput);
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

    mockHabitRepository.update.mockResolvedValue(updatedHabit);

    const result = await habitService.updateHabit('1', updates);
    expect(result).toEqual(updatedHabit);
    expect(mockHabitRepository.update).toHaveBeenCalledWith('1', updates);
  });

  it('should delete a habit', async () => {
    mockHabitRepository.delete.mockResolvedValue(undefined);

    await habitService.deleteHabit('1');
    expect(mockHabitRepository.delete).toHaveBeenCalledWith('1');
  });
});

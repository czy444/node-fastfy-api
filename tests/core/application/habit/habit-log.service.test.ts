import { HabitLogService } from '../../../../src/core/application/habit/habit-log.service';
import { HabitLogRepository } from '../../../../src/core/application/habit/habit-log.repository';
import { HabitLog } from '../../../../src/core/domain/habit/habit-log.entity';

describe('HabitLogService', () => {
  let habitLogService: HabitLogService;
  let mockHabitLogRepository: jest.Mocked<HabitLogRepository>;

  beforeEach(() => {
    mockHabitLogRepository = {
      findById: jest.fn(),
      findByHabitId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    habitLogService = new HabitLogService(mockHabitLogRepository);
  });

  it('should get a habit log by ID', async () => {
    const habitLog: HabitLog = {
      id: '1',
      habitId: 'habit1',
      date: new Date(),
      pointsEarned: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockHabitLogRepository.findById.mockResolvedValue(habitLog);

    const result = await habitLogService.getHabitLogById('1');
    expect(result).toEqual(habitLog);
    expect(mockHabitLogRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should get habit logs by habit ID', async () => {
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
    mockHabitLogRepository.findByHabitId.mockResolvedValue(habitLogs);

    const result = await habitLogService.getHabitLogsByHabitId('habit1');
    expect(result).toEqual(habitLogs);
    expect(mockHabitLogRepository.findByHabitId).toHaveBeenCalledWith('habit1');
  });

  it('should create a new habit log', async () => {
    const newHabitLogInput = {
      habitId: 'habit2',
      pointsEarned: 5,
      date: new Date(),
    };
    const createdHabitLog: HabitLog = {
      id: '3',
      ...newHabitLogInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockHabitLogRepository.create.mockResolvedValue(createdHabitLog);

    const result = await habitLogService.createHabitLog(newHabitLogInput);
    expect(result).toEqual(createdHabitLog);
    expect(mockHabitLogRepository.create).toHaveBeenCalledWith(newHabitLogInput);
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

    mockHabitLogRepository.update.mockResolvedValue(updatedHabitLog);

    const result = await habitLogService.updateHabitLog('1', updates);
    expect(result).toEqual(updatedHabitLog);
    expect(mockHabitLogRepository.update).toHaveBeenCalledWith('1', updates);
  });

  it('should delete a habit log', async () => {
    mockHabitLogRepository.delete.mockResolvedValue(undefined);

    await habitLogService.deleteHabitLog('1');
    expect(mockHabitLogRepository.delete).toHaveBeenCalledWith('1');
  });
});

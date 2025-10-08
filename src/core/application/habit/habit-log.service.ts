import { HabitLog } from "core/domain/habit/habit-log.entity";
import { HabitLogRepository } from "./habit-log.repository";

export class HabitLogService {
  constructor(private readonly habitLogRepository: HabitLogRepository) {}

  async getHabitLogById(id: string): Promise<HabitLog | null> {
    return this.habitLogRepository.findById(id);
  }

  async getHabitLogsByHabitId(habitId: string): Promise<HabitLog[]> {
    return this.habitLogRepository.findByHabitId(habitId);
  }

  async createHabitLog(habitLog: Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HabitLog> {
    return this.habitLogRepository.create(habitLog);
  }

  async updateHabitLog(id: string, habitLog: Partial<HabitLog>): Promise<HabitLog> {
    return this.habitLogRepository.update(id, habitLog);
  }

  async deleteHabitLog(id: string): Promise<void> {
    return this.habitLogRepository.delete(id);
  }
}

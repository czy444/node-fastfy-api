import { HabitLog } from "core/domain/habit/habit-log.entity";

export interface HabitLogRepository {
  findById(id: string): Promise<HabitLog | null>;
  findByHabitId(habitId: string): Promise<HabitLog[]>;
  create(habitLog: Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HabitLog>;
  update(id: string, habitLog: Partial<HabitLog>): Promise<HabitLog>;
  delete(id: string): Promise<void>;
}

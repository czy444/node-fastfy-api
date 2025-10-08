import { Habit } from "core/domain/habit/habit.entity";

export interface HabitRepository {
  findById(id: string): Promise<Habit | null>;
  findByUserId(userId: string): Promise<Habit[]>;
  create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit>;
  update(id: string, habit: Partial<Habit>): Promise<Habit>;
  delete(id: string): Promise<void>;
}

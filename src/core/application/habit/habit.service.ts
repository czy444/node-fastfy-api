import { Habit } from "core/domain/habit/habit.entity";
import { HabitRepository } from "./habit.repository";

export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async getHabitById(id: string): Promise<Habit | null> {
    return this.habitRepository.findById(id);
  }

  async getHabitsByUserId(userId: string): Promise<Habit[]> {
    return this.habitRepository.findByUserId(userId);
  }

  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    return this.habitRepository.create(habit);
  }

  async updateHabit(id: string, habit: Partial<Habit>): Promise<Habit> {
    return this.habitRepository.update(id, habit);
  }

  async deleteHabit(id: string): Promise<void> {
    return this.habitRepository.delete(id);
  }
}

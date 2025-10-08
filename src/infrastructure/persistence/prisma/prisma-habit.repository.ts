import { PrismaClient } from "@prisma/client";
import { Habit } from "core/domain/habit/habit.entity";
import { HabitRepository } from "core/application/habit/habit.repository";

export class PrismaHabitRepository implements HabitRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({ where: { userId } });
  }

  async create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    return this.prisma.habit.create({ data: habit });
  }

  async update(id: string, habit: Partial<Habit>): Promise<Habit> {
    return this.prisma.habit.update({ where: { id }, data: habit });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.habit.delete({ where: { id } });
  }
}

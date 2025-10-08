import { PrismaClient } from "@prisma/client";
import { HabitLog } from "core/domain/habit/habit-log.entity";
import { HabitLogRepository } from "core/application/habit/habit-log.repository";

export class PrismaHabitLogRepository implements HabitLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<HabitLog | null> {
    return this.prisma.habitLog.findUnique({ where: { id } });
  }

  async findByHabitId(habitId: string): Promise<HabitLog[]> {
    return this.prisma.habitLog.findMany({ where: { habitId } });
  }

  async create(habitLog: Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HabitLog> {
    return this.prisma.habitLog.create({ data: habitLog });
  }

  async update(id: string, habitLog: Partial<HabitLog>): Promise<HabitLog> {
    return this.prisma.habitLog.update({ where: { id }, data: habitLog });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.habitLog.delete({ where: { id } });
  }
}

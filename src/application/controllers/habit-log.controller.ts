import { FastifyReply, FastifyRequest } from 'fastify';
import { HabitLogService } from 'core/application/habit/habit-log.service';
import { HabitLog } from 'core/domain/habit/habit-log.entity';

export class HabitLogController {
  constructor(private readonly habitLogService: HabitLogService) {}

  async createHabitLog(request: FastifyRequest, reply: FastifyReply) {
    const { habitId, pointsEarned } = request.body as Omit<HabitLog, 'id' | 'createdAt' | 'updatedAt' | 'date'>;

    try {
      const newHabitLog = await this.habitLogService.createHabitLog({ habitId, pointsEarned, date: new Date() });
      return reply.code(201).send(newHabitLog);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error creating habit log', error: error.message });
    }
  }

  async getHabitLogById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const habitLog = await this.habitLogService.getHabitLogById(id);
      if (!habitLog) {
        return reply.code(404).send({ message: 'Habit log not found' });
      }
      return reply.code(200).send(habitLog);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching habit log', error: error.message });
    }
  }

  async getHabitLogsByHabitId(request: FastifyRequest, reply: FastifyReply) {
    const { habitId } = request.params as { habitId: string };

    try {
      const habitLogs = await this.habitLogService.getHabitLogsByHabitId(habitId);
      return reply.code(200).send(habitLogs);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching habit logs', error: error.message });
    }
  }

  async updateHabitLog(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const updates = request.body as Partial<HabitLog>;

    try {
      const updatedHabitLog = await this.habitLogService.updateHabitLog(id, updates);
      if (!updatedHabitLog) {
        return reply.code(404).send({ message: 'Habit log not found' });
      }
      return reply.code(200).send(updatedHabitLog);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error updating habit log', error: error.message });
    }
  }

  async deleteHabitLog(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      await this.habitLogService.deleteHabitLog(id);
      return reply.code(204).send();
    } catch (error: any) {
      reply.code(500).send({ message: 'Error deleting habit log', error: error.message });
    }
  }
}

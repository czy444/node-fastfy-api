import { FastifyReply, FastifyRequest } from 'fastify';
import { HabitService } from 'core/application/habit/habit.service';
import { Habit } from 'core/domain/habit/habit.entity';

export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  async createHabit(request: FastifyRequest, reply: FastifyReply) {
    const { name, description, points, category, userId } = request.body as Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

    try {
      const newHabit = await this.habitService.createHabit({ name, description, points, category, userId });
      return reply.code(201).send(newHabit);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error creating habit', error: error.message });
    }
  }

  async getHabitById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const habit = await this.habitService.getHabitById(id);
      if (!habit) {
        return reply.code(404).send({ message: 'Habit not found' });
      }
      return reply.code(200).send(habit);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching habit', error: error.message });
    }
  }

  async getHabitsByUserId(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };

    try {
      const habits = await this.habitService.getHabitsByUserId(userId);
      return reply.code(200).send(habits);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching user habits', error: error.message });
    }
  }

  async updateHabit(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const updates = request.body as Partial<Habit>;

    try {
      const updatedHabit = await this.habitService.updateHabit(id, updates);
      if (!updatedHabit) {
        return reply.code(404).send({ message: 'Habit not found' });
      }
      return reply.code(200).send(updatedHabit);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error updating habit', error: error.message });
    }
  }

  async deleteHabit(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      await this.habitService.deleteHabit(id);
      return reply.code(204).send();
    } catch (error: any) {
      reply.code(500).send({ message: 'Error deleting habit', error: error.message });
    }
  }
}

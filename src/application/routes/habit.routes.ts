import { FastifyInstance } from 'fastify';
import { HabitController } from '../controllers/habit.controller';
import { createHabitSchema, updateHabitSchema, habitIdParamSchema, userIdParamSchema } from '../schemas/habit.schemas';
import { container } from 'src/container';

export async function habitRoutes(fastify: FastifyInstance) {
  const habitController = new HabitController(container.habitService);

  fastify.post('/habits', {
    schema: {
      body: createHabitSchema,
    },
    handler: habitController.createHabit.bind(habitController),
  });

  fastify.get('/habits/:id', {
    schema: {
      params: habitIdParamSchema,
    },
    handler: habitController.getHabitById.bind(habitController),
  });

  fastify.get('/users/:userId/habits', {
    schema: {
      params: userIdParamSchema,
    },
    handler: habitController.getHabitsByUserId.bind(habitController),
  });

  fastify.put('/habits/:id', {
    schema: {
      params: habitIdParamSchema,
      body: updateHabitSchema,
    },
    handler: habitController.updateHabit.bind(habitController),
  });

  fastify.delete('/habits/:id', {
    schema: {
      params: habitIdParamSchema,
    },
    handler: habitController.deleteHabit.bind(habitController),
  });
}

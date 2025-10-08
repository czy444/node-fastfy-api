import { FastifyInstance } from 'fastify';
import { HabitLogController } from '../controllers/habit-log.controller';
import { createHabitLogSchema, updateHabitLogSchema, habitLogIdParamSchema, habitIdParamForLogSchema } from '../schemas/habit-log.schemas';
import { container } from 'src/container';

export async function habitLogRoutes(fastify: FastifyInstance) {
  const habitLogController = new HabitLogController(container.habitLogService);

  fastify.post('/habit-logs', {
    schema: {
      body: createHabitLogSchema,
    },
    handler: habitLogController.createHabitLog.bind(habitLogController),
  });

  fastify.get('/habit-logs/:id', {
    schema: {
      params: habitLogIdParamSchema,
    },
    handler: habitLogController.getHabitLogById.bind(habitLogController),
  });

  fastify.get('/habits/:habitId/logs', {
    schema: {
      params: habitIdParamForLogSchema,
    },
    handler: habitLogController.getHabitLogsByHabitId.bind(habitLogController),
  });

  fastify.put('/habit-logs/:id', {
    schema: {
      params: habitLogIdParamSchema,
      body: updateHabitLogSchema,
    },
    handler: habitLogController.updateHabitLog.bind(habitLogController),
  });

  fastify.delete('/habit-logs/:id', {
    schema: {
      params: habitLogIdParamSchema,
    },
    handler: habitLogController.deleteHabitLog.bind(habitLogController),
  });
}

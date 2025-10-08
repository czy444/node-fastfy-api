import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { container } from 'src/container';

async function habitLogPlugin(fastify: FastifyInstance) {
  fastify.decorate('habitLogService', container.habitLogService);
  fastify.register(container.habitLogRoutes, { prefix: '/api' });
}

export default fp(habitLogPlugin);

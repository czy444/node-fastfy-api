import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { container } from 'src/container';

async function habitPlugin(fastify: FastifyInstance) {
  fastify.decorate('habitService', container.habitService);
  fastify.register(container.habitRoutes, { prefix: '/api' });
}

export default fp(habitPlugin);

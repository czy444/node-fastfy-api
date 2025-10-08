import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { container } from 'src/container';

async function userPlugin(fastify: FastifyInstance) {
  fastify.decorate('userService', container.userService);
  fastify.register(container.userRoutes, { prefix: '/api' });
}

export default fp(userPlugin);

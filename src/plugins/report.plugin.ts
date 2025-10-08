import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { container } from 'src/container';

async function reportPlugin(fastify: FastifyInstance) {
  fastify.decorate('reportService', container.reportService);
  fastify.register(container.reportRoutes, { prefix: '/api' });
}

export default fp(reportPlugin);

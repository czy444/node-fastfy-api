import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken } from 'utils/jwt';
import { UserService } from 'core/application/user/user.service';

async function authPlugin(fastify: FastifyInstance, options: object) {
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const publicRoutes = ['/api/users/register', '/api/users/login'];
    if (publicRoutes.some(route => request.url.startsWith(route))) {
      return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token) as { id: string; email: string };
      const userService = fastify.userService as UserService;
      const user = await userService.getUserById(decoded.id);

      if (!user) {
        return reply.code(401).send({ message: 'Unauthorized: User not found' });
      }

      request.user = {
        id: user.id,
        email: user.email,
      };
    } catch (error: any) {
      return reply.code(401).send({ message: 'Unauthorized: Invalid token', error: error.message });
    }
  });
}

export default fp(authPlugin);

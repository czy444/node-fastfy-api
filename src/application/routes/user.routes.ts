import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { registerUserSchema, loginUserSchema } from '../schemas/user.schemas';
import { container } from 'src/container';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController(container.userService);

  fastify.post('/users/register', {
    schema: {
      body: registerUserSchema,
    },
    handler: userController.registerUser.bind(userController),
  });

  fastify.post('/users/login', {
    schema: {
      body: loginUserSchema,
    },
    handler: userController.loginUser.bind(userController),
  });

  fastify.get('/users/:id', userController.getUserProfile.bind(userController));
}

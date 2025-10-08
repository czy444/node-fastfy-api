import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from 'core/application/user/user.service';
import { User } from 'core/domain/user/user.entity';
import { RegisterUserSchema, LoginUserSchema } from '../schemas/user.schemas';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async registerUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username } = request.body as RegisterUserSchema;

    try {
      const newUser = await this.userService.createUser({ email, password, username });
      return reply.code(201).send(newUser);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error registering user', error: error.message });
    }
  }

  async loginUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as LoginUserSchema;

    try {
      const authResult = await this.userService.login(email, password);
      if (!authResult) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }
      const { user, token } = authResult;
      return reply.code(200).send({ user, token });
    } catch (error: any) {
      reply.code(500).send({ message: 'Error logging in', error: error.message });
    }
  }

  async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }
      return reply.code(200).send(user);
    } catch (error: any) {
      reply.code(500).send({ message: 'Error fetching user profile', error: error.message });
    }
  }
}

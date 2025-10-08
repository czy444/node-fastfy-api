import Fastify from 'fastify';
import zodValidatorPlugin from 'plugins/zod-validator';
import authPlugin from 'plugins/auth';
import userPlugin from 'plugins/user.plugin';
import habitPlugin from 'plugins/habit.plugin';
import habitLogPlugin from 'plugins/habit-log.plugin';
import reportPlugin from 'plugins/report.plugin';
import { container } from 'src/container'; 

export const buildServer = async () => {
  const fastify = Fastify({
    logger: true,
  });

  // Register core plugins
  await fastify.register(zodValidatorPlugin);
  await fastify.register(authPlugin);

  // Register domain plugins
  await fastify.register(userPlugin);
  await fastify.register(habitPlugin);
  await fastify.register(habitLogPlugin);
  await fastify.register(reportPlugin);

  // Start scheduler
  container.scheduler.start();

  return fastify;
};

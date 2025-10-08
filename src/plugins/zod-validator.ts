import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

async function zodValidatorPlugin(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.setValidatorCompiler(({ schema }) => {
    return (data) => {
      try {
        if (schema instanceof ZodSchema) {
          schema.parse(data);
          return { value: data };
        }
        return { value: data };
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          return { error };
        }
        throw error;
      }
    };
  });

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.issues.map((e: ZodIssue) => ({ path: e.path.join('.'), message: e.message })),
      });
    } else {
      fastify.log.error(error);
      reply.code(500).send({ message: 'Internal Server Error', error: (error as Error).message });
    }
  });

  fastify.addHook('onRoute', (routeOptions: RouteOptions) => {
    if (routeOptions.schema) {
      if (routeOptions.schema.body instanceof ZodSchema) {
        routeOptions.schema.body = zodToJsonSchema(routeOptions.schema.body);
      }
      if (routeOptions.schema.querystring instanceof ZodSchema) {
        routeOptions.schema.querystring = zodToJsonSchema(routeOptions.schema.querystring);
      }
      if (routeOptions.schema.params instanceof ZodSchema) {
        routeOptions.schema.params = zodToJsonSchema(routeOptions.schema.params);
      }
      if (routeOptions.schema.headers instanceof ZodSchema) {
        routeOptions.schema.headers = zodToJsonSchema(routeOptions.schema.headers);
      }
    }
  });
}

export default fp(zodValidatorPlugin);

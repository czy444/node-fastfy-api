import { ZodSchema } from 'zod';

declare module 'fastify' {
  interface FastifySchema {
    body?: ZodSchema;
    querystring?: ZodSchema;
    params?: ZodSchema;
    headers?: ZodSchema;
  }
}

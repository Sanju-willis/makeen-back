// src\plugins\env.ts
import fp from 'fastify-plugin';
import env from '@fastify/env';

export default fp(async (fastify) => {
  fastify.register(env, {
    dotenv: true,
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: { type: 'string' },
        JWT_SECRET: { type: 'string' },
      },
    },
  });
});

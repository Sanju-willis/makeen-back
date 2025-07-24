// src\plugins\cors.ts
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
  });
});

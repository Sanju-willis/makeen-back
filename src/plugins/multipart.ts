// src/plugins/multipart.ts
import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export default fp(async (fastify) => {
  console.log("📦 multipart plugin loaded");
  
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1, // Max 1 file per request
    }
  });
}, {
  name: 'multipart-support'
});
import { fastify } from "@src/server.js";

// Boot the server
try {
  const host = fastify.config.environment.host;
  const port = fastify.config.environment.port;
  await fastify.listen({ host, port });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
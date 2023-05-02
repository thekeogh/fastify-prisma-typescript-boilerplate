import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {

  /**
   * Route handler for the root endpoint ("/").
   *
   * @function
   * @name GET /
   */
  fastify.get("/", fastify.resources.core.schemas.root, async function (request, reply) {
    return reply.code(204).send();
  });
};

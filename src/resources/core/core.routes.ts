import { FastifyInstance } from "fastify";

import { schemas } from "@resources/core/index.js";

export default async (fastify: FastifyInstance) => {

  /**
   * Route handler for the root endpoint ("/").
   *
   * @function
   * @name GET /
   */
  fastify.get("/", schemas.root, async function (request, reply) {
    return reply.code(204).send();
  });
};

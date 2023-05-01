import { FastifyInstance } from "fastify";

import { controllers, schemas } from "@resources/users/index.js";

export default async (fastify: FastifyInstance) => {

  /**
   * Create a new user
   *
   * @function
   * @name POST /users
   */
  fastify.post<Api.Schemas.Users.Create.Request>("/users", schemas.create, async function (request, reply) {
    return new controllers.Create(request, reply).handle();
  });
};

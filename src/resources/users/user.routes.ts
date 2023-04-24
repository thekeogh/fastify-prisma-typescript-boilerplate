import { FastifyInstance } from "fastify";

import { controllers, schemas } from "@src/resources/users/index.js";

export default async (fastify: FastifyInstance) => {

  /**
   * Create a new user
   *
   * @function
   * @name POST /users
   */
  fastify.post<{ Body: Api.Resources.Users.Create.Body }>("/users", schemas.create, async function (request, reply) {
    return new controllers.Create(request.body, reply).handle();
  });
};

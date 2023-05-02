import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {

  /**
   * Create a new user
   *
   * @function
   * @name POST /users
   */
  fastify.post<Api.Schemas.Users.Create.Request>("/users", fastify.resources.users.schemas.create, async function (request, reply) {
    return new fastify.resources.users.controllers.Create(request, reply, this).handle();
  });
};

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class Create {
  private request: FastifyRequest<Api.Schemas.Users.Create.Request>;
  private reply: FastifyReply;
  private fastify: FastifyInstance;

  public constructor(request: FastifyRequest<Api.Schemas.Users.Create.Request>, reply: FastifyReply, fastify: FastifyInstance) {
    this.request = request;
    this.reply = reply;
    this.fastify = fastify;
  }

  public async handle() {
    // Is this email address already registered?
    let user = await this.fastify.resources.users.repositories.userRepository.findByEmail(this.request.body.email);
    if (user) {
      return this.reply.conflict(`User by the email address '${this.request.body.email}' already exists.`);
    }
    // Nope, then create them...
    user = await this.fastify.resources.users.repositories.userRepository.create({
      email: this.request.body.email,
      name: this.request.body.name,
    });
    // Done!
    return this.reply.code(201).send(user);
  }
}

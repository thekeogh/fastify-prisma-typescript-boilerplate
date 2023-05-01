import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

import { users } from "@resources/index.js";

export class Create {
  private request: FastifyRequest<Api.Schemas.Users.Create.Request>;
  private reply: FastifyReply;
  private user: User | null;

  public constructor(request: FastifyRequest<Api.Schemas.Users.Create.Request>, reply: FastifyReply) {
    this.request = request;
    this.reply = reply;
    this.user = null;
  }

  public async handle() {
    // Is this email address already registered?
    this.user = await users.repositories.userRepository.findByEmail(this.request.body.email);
    if (this.user) {
      return this.reply.conflict(`User by the email address '${this.request.body.email}' already exists.`);
    }
    // Nope, then create them...
    this.user = await users.repositories.userRepository.create({
      email: this.request.body.email,
      name: this.request.body.name,
    });
    // Done!
    return this.reply.code(201).send(this.user);
  }
}

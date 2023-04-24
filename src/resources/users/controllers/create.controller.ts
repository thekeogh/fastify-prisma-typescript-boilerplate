import { User } from "@prisma/client";
import { FastifyReply } from "fastify";

import { repositories } from "@src/resources/users/index.js";

export class Create {
  private body: Api.Resources.Users.Create.Body;
  private reply: FastifyReply;
  private repository: repositories.UserRepository;
  private user: User | null;

  /**
   * Construct the request
   */
  public constructor(body: Api.Resources.Users.Create.Body, reply: FastifyReply) {
    this.body = body;
    this.reply = reply;
    this.repository = new repositories.UserRepository();
    this.user = null;
  }

  /**
   * Handle the request
   */
  async handle() {
    // Is this email address already registered?
    this.user = await this.repository.findByEmail(this.body.email);
    if (this.user) {
      return this.reply.conflict(`User by the email address '${this.body.email}' already exists.`);
    }
    // Nope, then create them...
    this.user = await this.repository.create({
      email: this.body.email,
      name: this.body.name,
    });
    // Done!
    return this.reply.code(201).send(this.user);
  }

}
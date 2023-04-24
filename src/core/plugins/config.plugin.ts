import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { core } from "@core";

/**
 * Instruct TypeScript that this value exists on the Fastify instance.
 */
declare module "fastify" {
  interface FastifyInstance {
    config: Api.Core.Config.Api;
  }
}

/**
 * Configured Fastify plugin that allows access to the API configuration object
 * from the Fastify instance.
 * 
 * @example 
 *  // Inside a Fastify route handler:
 *  fastify.get("/", function () {
 *    const config = this.config;
 *    // Use the config object to access API configuration options.
 *  }
 */
export const config: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.decorate<Api.Core.Config.Api>("config", core.config.api);
});


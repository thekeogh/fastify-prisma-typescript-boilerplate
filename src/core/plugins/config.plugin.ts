import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { config as _config } from "@core/index.js";

/**
 * Instruct TypeScript that this value exists on the Fastify instance.
 */
declare module "fastify" {
  interface FastifyInstance {
    config: Api.Core.Config.Api;
  }
}

/**
 * Decorate Fastify with the plugin.
 */
export const config: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.decorate<Api.Core.Config.Api>("config", _config.api);
});


import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import * as _resources from "@resources/index.js";

/**
 * Instruct TypeScript that this value exists on the Fastify instance.
 */
type Resources = typeof _resources;
declare module "fastify" {
  interface FastifyInstance {
    resources: Resources;
  }
}

/**
 * Decorate Fastify with the plugin.
 */
export const resources: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.decorate<Resources>("resources", _resources);
});


import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import pressure from "@fastify/under-pressure";
import Fastify from "fastify";

import { core } from "@core";

// Initialise
const { ajv, logger, https } = core.config.fastify;
const fastify = Fastify({ ignoreTrailingSlash: true, ajv, logger, https });

// Plugins
await fastify.register(core.plugins.config);
await fastify.register(sensible);
await fastify.register(cors, core.config.fastify.cors);
await fastify.register(helmet, core.config.fastify.helmet);
await fastify.register(pressure, core.config.fastify.underPressure);
await fastify.register(swagger, core.config.fastify.swagger);
await fastify.register(swaggerUi, core.config.fastify.swaggerUi);

// Routes
await fastify.register(autoload, core.config.fastify.routes);

export { fastify };
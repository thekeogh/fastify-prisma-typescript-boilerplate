import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import pressure from "@fastify/under-pressure";
import Fastify from "fastify";

import { config, plugins } from "@core/index.js";

// Initialise
const { ajv, logger, https } = config.fastify;
const fastify = Fastify({ ignoreTrailingSlash: true, ajv, logger, https });

// Plugins
await fastify.register(plugins.config);
await fastify.register(sensible);
await fastify.register(cors, config.fastify.cors);
await fastify.register(helmet, config.fastify.helmet);
await fastify.register(pressure, config.fastify.underPressure);
await fastify.register(swagger, config.fastify.swagger);
await fastify.register(swaggerUi, config.fastify.swaggerUi);

// Routes
await fastify.register(autoload, config.fastify.routes);

export { fastify };
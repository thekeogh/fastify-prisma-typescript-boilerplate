import { readFileSync } from "fs";
import { ServerOptions } from "https";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { Options as AjvOptions } from "@fastify/ajv-compiler";
import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyCorsOptions } from "@fastify/cors";
import { FastifyHelmetOptions } from "@fastify/helmet";
import { SwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { UnderPressureOptions } from "@fastify/under-pressure";
import { LoggerOptions } from "pino";

import { api } from "@src/core/config/index.js";

/**
 * Configuration options for the Ajv JSON schema validator.
 * 
 * @see {@link https://ajv.js.org/ Ajv JSON schema validator}
 */
const ajv: { customOptions: AjvOptions } = {
  customOptions: {
    removeAdditional: "all",
    coerceTypes: false,
    useDefaults: true,
  },
};

/**
 * Configuration options for CORS (Cross-Origin Resource Sharing).
 */
const cors: FastifyCorsOptions = {
  origin: /(\.next\.sc|\.screencloud\.com|\.screen\.cloud)(:[0-9]+)?$/,
  preflightContinue: false,
  credentials: true,
};

/**
 * Configuration options for the Helmet middleware, which helps secure the
 * service by setting various HTTP headers.
 * 
 * @see {@link https://helmetjs.github.io Helmet}
 */
const helmet: FastifyHelmetOptions = {
  hidePoweredBy: true,
  frameguard: true,
  hsts: true,
  xssFilter: true,
  noSniff: true,
  permittedCrossDomainPolicies: true,
};

/**
* Sets up an HTTPS server for local development if SSL keys are provided as
* environment variables.
* 
* @param {string} process.env.SSL_KEY - Path to the SSL key file.
* @param {string} process.env.SSL_CERT - Path to the SSL certificate file.
*/
let https: ServerOptions | null = null;
if ((api.environment.env === "development" && process.env.SSL_KEY && process.env.SSL_CERT)) {
  https = {
    key: readFileSync(process.cwd() + process.env.SSL_KEY),
    cert: readFileSync(process.cwd() + process.env.SSL_CERT),
  };
}

/**
 * Configures the logging options for the application using the Pino logging
 * library.
 * 
 * @see {@link https://github.com/pinojs/pino Pino}
 */
const logger: LoggerOptions = {
  level: api.logging.level,
  transport: api.environment.env === "development" ? {
    target: "pino-pretty",
    options: {
      colorize: true,
      colorizeObjects: true,
      singleLine: true,
      crlf: true,
      levelFirst: true,
      translateTime: "dd/mm/yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  } : undefined,
};

/**
 * Configuration object for the Fastify Autoload plugin that loads all routes
 * from the `/src/routes` directory.
 * 
 * @remarks
 * This configuration is only meant for autoloading routes and does not
 * autoload any other plugins.
 */
const routes: AutoloadPluginOptions = {
  dir: join(dirname(fileURLToPath(import.meta.url)), "../..", "resources"),
  dirNameRoutePrefix: false,
  matchFilter: (path) => path.includes(".routes."),
  indexPattern: /.*routes(\.ts|\.js|\.cjs|\.mjs)$/,
  routeParams: false,
  forceESM: true,
  options: { prefix: api.api.prefix },
};

/**
 * Configuration for the core Swagger documentation, which is a widely-used
 * tool for documenting RESTful APIs using the OpenAPI specification. 
 * 
 * @see {@link https://swagger.io/tools/swagger-ui/ Swagger UI}
 * @see {@link https://github.com/OAI/OpenAPI-Specification OpenAPI specification}
* @see {@link https://github.com/fastify/fastify-swagger Fastify Swagger}
*/
const swagger: SwaggerOptions = {
  openapi: {
    info: {
      title: api.swagger.title,
      description: api.swagger.description,
      version: "1.0.0", // TODO: get from package.json maybe? Will we use SR?
    },
    servers: [{
      url: api.swagger.url,
    }],
  },
};

/**
* Configuration for the Swagger UI, which is a tool for visualizing and
* interacting with the API documentation written in the OpenAPI specification. 
* 
* @see {@link https://swagger.io/tools/swagger-ui/ Swagger UI}
* @see {@link https://github.com/fastify/fastify-swagger Fastify Swagger}
*/
const swaggerUi: FastifySwaggerUiOptions = {
  routePrefix: "/explorer",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
};

/**
 * Configuration options for Under Pressure, a library that measures process
 * load with automatic handling of the "Service Unavailable" response.
 * 
 * @see {@link https://github.com/fastify/under-pressure Fastify Under Pressure}
 */
const underPressure: UnderPressureOptions = {
  exposeStatusRoute: {
    routeOpts: {
      logLevel: api.logging.level,
    },
    url: "/health-check",
  },
  healthCheck: async () => {
    // TODO: Do other health checks here, e.g. DB connection
    return true;
  },
  healthCheckInterval: 500,
};

export const fastify = {
  ajv,
  cors,
  helmet,
  https,
  logger,
  routes,
  swagger,
  swaggerUi,
  underPressure,
};
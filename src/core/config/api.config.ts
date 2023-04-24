/**
 * API configuration object.
 * 
 * @description
 * This object contains configuration options for the API and can be accessed
 * outside of the Fastify instance.
 * 
 * To access the config when you have access to the Fastify instance,
 * please see the Config Plugin in '../plugins/config.plugin.ts'
 */
export const api: Api.Core.Config.Api = {

  // Environment
  environment: {
    env: process.env.NODE_ENV,
    host: process.env.HOST || "",
    port: process.env.PORT && +process.env.PORT || 5050,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },

  // Swagger
  swagger: {
    title: "Billing Service Sandbox",
    description: "ScreenCloud billing service that is in an experimental phase, intended for trying out a new technology stack",
    url: process.env.SWAGGER_URL,
  },

  // API
  api: {
    prefix: "v2",
  },

};

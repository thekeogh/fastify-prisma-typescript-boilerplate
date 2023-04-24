/**
 * Defines the environmental variables used by the service.
 *
 * @remarks
 * Be sure to include any extra `.env` variables in this file. TypeScript will
 * automatically detect and incorporate them into the `process.env` object.
 */

declare namespace NodeJS {

  interface ProcessEnv {
    // Environment
    readonly NODE_ENV: Api.Environment;
    readonly HOST?: string;
    readonly PORT?: string;
    readonly SSL_CERT?: string;
    readonly SSL_KEY?: string;

    // Logging
    readonly LOG_LEVEL?: import("pino").LevelWithSilent;

    // Database
    readonly DATABASE_URL: string;

    // Swagger
    readonly SWAGGER_URL: string;
  }

}
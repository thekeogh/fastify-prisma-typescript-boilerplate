# Fastify Prisma TypeScript Boilerplate

Fastify Prisma TypeScript Boilerplate is a starter kit for building RESTful APIs using [Fastify](https://www.fastify.io/) and [Prisma](https://www.prisma.io/) in a [TypeScript](https://www.typescriptlang.org/) environment for [Node.js](https://nodejs.org/en).

## Included

- All running under [Node](https://nodejs.org/en) 18.16 LTS (or above)
- [TypeScript](https://www.typescriptlang.org/) 5, [Fastify](https://www.fastify.io/) 4 and [Prisma](https://www.prisma.io) 4
- [ESLint](https://eslint.org/) and [Vitest](https://vitest.dev/)
- [`dotenv-flow`](https://github.com/kerimdzhanov/dotenv-flow) (for improved environmental variables)
- [ESM](https://nodejs.org/api/esm.html) (top-level awaits please!)
- [GitHub Actions](https://github.com/features/actions) (CI) coming soon
- [Docker](https://www.docker.com/) setup coming soon

## Setup

**Clone the repository:**

```shell
git clone git@github.com:thekeogh/fastify-prisma-typescript-boilerplate.git
```

**Install the dependencies:**

```shell
npm install
```

**Migrate the database:**

```shell
npm run migrate
```

> Please make sure that you have created the appropriate roles and database based on the `DATABASE_URL` specified in your `.env.local` file before running this command. See the [Enviromental Variables](#enviromental-variables) section for more.

**Generate artifacts** 

This command will generate all necessary artifacts, including TypeScript definitions, JSON Schemas and helpers for the service. See the [Artifacts](#artifacts) section for more.

```shell
npm run generate
```

**Setup SSL**

To enable SSL for the API in local development, you can use a self-signed certificate. To accomplish this, you will need to generate a self-signed SSL certificate locally by following our guide, which is available for both  [Microsoft Windows](https://gist.github.com/wmathes/db7524f083e89167111079ff9778330c) and [Apple macOS](https://gist.github.com/thekeogh/ed785cc0e8125731a6ff7fff306bc47e). Once this process is complete, the `server.key` and `server.crt` files will be generated. Copy these SSL files to the `/ssl` directory using the following steps:

```shell
cp /path/to/server.key /path/to/server.crt ./ssl
```

> To avoid utilising SSL locally, just leave the `SSL_CERT` and `SSL_KEY` fields blank in your `.env.development.local` configuration file. See the [Enviromental Variables](#enviromental-variables) section for more.

**Start the service:**

```shell
npm run dev
```

## Environmental Variables

If the default configuration in the `.env.development` file is not sufficient, you can create a `.env.development.local` file to customise the values according to your requirements.

```shell
touch .env.development.local
```

> To modify specific values, selectively copy them from the `.env.development` file and paste them here. Only copy the values that you intend to change, and avoid copying any values that do not need to be modified. If no changes are required, completely skip this step.

## Migration

Please take note that `dotenv-flow` is used to establish environment variables for all of the subsequent commands. Therefore, it's imperative to only execute these commands in a development environment. In production, the commands must be manually run and not via the `package.json`. You are welcome to change this of course.

To migrate any modifications made to the `schema.prisma` file and apply them to the database, use the following command:

```shell
npm run migrate:create

# ✔ Enter a name for the new migration: [name migration]
```

> By executing this command, a `.sql` script will be created and applied to the database without any manual intervention. Upon committing the generated `.sql` to version control, it can be readily deployed in production.

To initiate a complete database reset and apply all migrations (note that this will result in the loss of all data), run the following command:

```shell
npm run migrate:reset
```

> Please be cautious! Executing this command will delete all the data stored in the database. Use this command only when necessary.

If you wish to execute any pending migrations that have not yet been applied in your current environment, use the following command:

```shell
npm run migrate
```

> This command is considered safe to execute since it will only apply changes to the database that have not already been made. If there are no pending migrations, this command will not have any effect.

For more information on [Prisma](https://www.prisma.io), please read their [documentation](https://www.prisma.io/docs).

## Artifacts

In an effort to eliminate the need for repetitive code, the service can generate much of it for you by analyzing your JSON Schemas. This includes inferring TypeScript types from all of your JSON Schemas and creating the final schema definition for your Fastify routes. To generate these automatically, simply execute the following command:

```shell
npm run generate
```

The above command will generate all the service artifacts aswell as the Prisma artifacts. To generate only the service artifacts you can run:

```shell
npm run generate:schema
```

> You will find comments in all files that are generated by the command mentioned above, except for the `schemas/schema.json` file. This file is also generated by the command, but without any comments.

Conversely, to generate only the Prisma artifacts, run:

```shell
npm run generate:prisma
```

## API Documentation

The API fully leverages the fact that it is compliant with [OAS3](https://spec.openapis.org/oas/v3.0.3) standards by using the [Swagger UI](https://swagger.io/tools/swagger-ui/) to generate all documentation. You can view the Swagger UI for the API at the following endpoint:

```
/explorer
```

In JSON

```
/explorer/json
```

In YAML

```
/explorer/yaml
```

## Build

Since the service is built in TypeScript, it must be compiled to plain JavaScript before it can be deployed in a production environment. To achieve this, you can run the following command

```shell
npm run build
```

> The resulting JavaScript code should now be compiled and stored in the `/build` directory, which is now ready for deployment in a production environment.

To execute the compiled JavaScript, simply enter the following command:

```shell
npm start
```

## Deploy

It's worth highlighting that the majority of npm scripts are intended for use in the development environment and necessitate `dotenv-flow`. In contrast, production, specifically the Docker container, will manually execute all commands exclusive of the `package.json`.

As an example, the Docker script will boot the server like:

```dockerfile
CMD [ "node", "build/index.js" ]
```

Opposed to:

```dockerfile
CMD [ "npm", "start" ]
```

## Healthcheck

The API exposes the `/healthcheck` endpoint, which enables a health check of the service and its dependencies (such as the database), for instance, by ELB.

```json
{
  "status": "ok"
}
```

## Lint

To execute ESLint on the service, enter the following command:

```shell
npm run lint
```

To fix any linting errors automatically, run the following command:

```shell
npm run lint:fix
```

## Tests

[Vitest](https://vitest.dev/) is utilized to execute all tests.

Run the entire test suite:

```shell
npm run test
```

Run specific tests:

```shell
npm run test /path/fuzzy/glob/file
```

Watch for changes:

```shell
npm run test:watch
```


/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Generates TypeScript and Fastify OAS3/Swagger definitions from JSON schema definitions found in the src/ folder.
 * 
 * This script finds all schema definitions and generates a schema.d.ts file containing the inferred TypeScript
 * definitions for those JSON Schema objects.
 * 
 * Additionally, it creates the final Fastify OAS3/Swagger schema object by combining the parts, and saves it to a
 * schema.json file in the respective path along with entry points to fetch the schemas.
 * 
 * @cli npm run generate:schema
 * @cli npm run generate 
 * 
 * @see {@link https://github.com/bcherny/json-schema-to-typescript json-schema-to-typescript}
 * @see {@link https://swagger.io/specification/ Swagger Specification}
 * @see {@link https://spec.openapis.org/oas/v3.1.0 OpenAPI Specification}
 * @see {@link https://ajv.js.org/json-schema.html AJV JSON Schema}
 */

import path from "path";

import { config } from "./config.js";
import * as Types from "./types.js";
import { utils } from "./utils.js";

/**
 * Let's retrieve all templates required by the script now, ensuring that they are readily available for population and
 * subsequent disk persistence. By fetching the templates in advance, we can ensure that all necessary files are in
 * place before proceeding with any data processing, helping streamline the overall execution of the script.
 */
const templates = {
  typescript: await utils.templates.read("typescript"),
  schema: await utils.templates.read("schema"),
  entry: await utils.templates.read("entry"),
  exporter: await utils.templates.read("exporter"),
};

/**
 * Retrieve the .schema.json files located at the bottom of the directory chain, which serve as the parameter files,
 * and initiate a loop to construct the artifacts based on these files and their respective paths, and return this
 * object for persistence later.
 * 
 * @remarks
 * In this function, we solely create the artifacts object and do not perform any write operations to the disk.
 */
async function generateArtifacts(): Promise<Types.Artifacts> {
  const artifacts: Types.Artifacts = {};
  const filepaths = await utils.filesystem.search(config.dir.json, config.filename.parameters);
  if (!filepaths.length) {
    utils.notification.warn(`No parameter schema files found. Ensure they follow this pattern '${config.dir.json.replace(process.cwd(), "")}${config.filename.parameters}'.\n`);
    return process.exit(0);
  }
  for (const filepath of filepaths) {
    // Get the filepath parts needed for the artifacts object.
    const parts = path.parse(filepath);
    const resource = utils.filesystem.resource(parts.dir);
    const action = utils.filesystem.action(parts.dir);
    const parameter = utils.filesystem.parameter(parts.name);
    const code = utils.filesystem.code(parts.name);
    // Read the JSON schemas and generate the TypeScript definitions.
    const content: Types.Content = {
      json: JSON.parse(await utils.filesystem.read(filepath)),
      typescript: await utils.filesystem.compile(filepath),
    };
    // Start building the artifacts object, ensure we only merge if the keys already exist to prevent data overwriting.
    if (!Object.hasOwn(artifacts, resource)) {
      artifacts[resource] = {};
    }
    if (!Object.hasOwn(artifacts[resource], action)) {
      artifacts[resource][action] = {};
    }
    if (!Object.hasOwn(artifacts[resource][action], parameter)) {
      artifacts[resource][action][parameter] = {};
    }
    // Conclude the artifacts by adding the content. The approach varies slightly depending on the parameter.
    if (parameter === Types.Parameter.Response && code) {
      const response = artifacts[resource][action][parameter] as Types.Code;
      if (!Object.hasOwn(response, code)) {
        response[code] = content;
      }
    } else {
      artifacts[resource][action][parameter] = content;
    }
  }
  utils.notification.info("Artifacts object generated.");
  return artifacts;
}

/**
 * Now that we have the artifacts storage object finalised, we have all the data we need to persist the schema.d.ts
 * TypeScript definition to disk.
 * 
 * @remarks
 * Only the TypeScript schema.d.ts file will be persisted at this point; other files will be persisted later 
 * in another block.
 */
async function saveTypescript(artifacts: Types.Artifacts): Promise<void> {
  let typescript = "";
  for (const resource in artifacts) {
    const Resource = utils.string.sanitise(resource);
    typescript += `namespace ${Resource} {`;
    for (const action in artifacts[resource]) {
      const Action = utils.string.sanitise(action);
      // Before the definition, lets make the Fastify Request type
      let request = "";
      const parameters = utils.array.remove(Object.keys(artifacts[resource][action]), "response");
      parameters.forEach(parameter => {
        const Parameter = Object.keys(Types.Parameter).find((key) => Types.Parameter[key as keyof typeof Types.Parameter] === parameter) as string;
        request += `${Parameter}: Api.Schemas.${Resource}.${Action}.${Parameter}; `;
      });
      // Now we can write the def
      typescript += `namespace ${Action} {`;
      typescript += utils.object.find(artifacts[resource][action], "typescript").join("\n");
      if (request.length) {
        typescript += `type Request = { ${request} }`;
      }
      typescript += "}";
    }
    typescript += "}";
  }
  const filepath = config.dir.typescript + config.filename.typescript;
  const contents = utils.templates.prettier(templates.typescript.replace("{{ children }}", typescript), "typescript");
  utils.notification.info("TypeScript definition successfully saved.");
  await utils.filesystem.write(filepath, contents);
}

/**
 * Now that we have the artifacts storage object finalised, we have all the data we need to persist the Fastify
 * schema.json files to disk.
 * 
 * @remarks
 * This file is essentially the composite file that contains all of the parameter JSON schemas.
 */
async function saveSchemas(artifacts: Types.Artifacts): Promise<void> {
  for (const resource in artifacts) {
    for (const action in artifacts[resource]) {
      const filepath = config.dir.json.replace("**", resource).replace("**", action) + "schema.json";
      if (!await utils.filesystem.exists(filepath)) {
        // Create the schema.json file for us
        utils.notification.warn(`Missing schema.json for '${resource}/${action}'. Creating an empty schema file for you.`);
        await utils.filesystem.write(filepath, templates.schema);
        utils.notification.info(`Schema for '${resource}/${action}' successfully created.`);
      }
      // Read the file now and convert to JSON so we can manipulate
      const route: Types.Schema = JSON.parse(await utils.filesystem.read(filepath));
      // Now we need to delete all the parameter keys so we get the correct results
      Object.values(Types.Parameter).forEach(p => delete route.schema[p]);
      for (const param in artifacts[resource][action]) {
        const parameter = param as Types.Parameter;
        if (parameter === Types.Parameter.Response) {
          // Response object
          const data = artifacts[resource][action][parameter] as Types.Code;
          route.schema.response = {};
          for (const code in data) {
            const response = data[code];
            // @ts-ignore: Ignore Fastify's unknown casting here, this is right!
            route.schema.response[code] = response.json;
          }
        } else {
          // Non-Response object
          const data = artifacts[resource][action][parameter] as Types.Content;
          route.schema[parameter] = data.json;
        }
      }
      // Now we can write the file
      await utils.filesystem.write(filepath, utils.templates.prettier(JSON.stringify(route), "json"));
      utils.notification.info(`Schema for '${resource}/${action}' successfully saved.`);
    }
  }
}

/**
 * After finalizing the artifacts storage object and saving the schema.json files, the JSON exporter file can be
 * generated and saved to the disk. This file is intended to directly export the JSON from the schema as JSON to the
 * consumer.
 * 
 * @remarks
 * As of the LTS version of Node 18.*.*, import assertions continue to be marked as experimental, and warnings are
 * displayed when JSON modules are imported. Due to this, we use `fs.readFile` to retrieve the contents of JSON files.
 */
async function saveExporter(artifacts: Types.Artifacts): Promise<void> {
  for (const resource in artifacts) {
    for (const action in artifacts[resource]) {
      const filepath = config.dir.json.replace("**", resource).replace("**", action) + "index.ts";
      const contents = utils.templates.prettier(templates.exporter.replace("{{ action }}", action), "typescript");
      await utils.filesystem.write(filepath, contents);
      utils.notification.info(`Exporter for '${resource}/${action}' successfully saved.`);
    }
  }
}

/**
 * Finally, we can create and persist the entry point for each resource action, which serves the purpose of providing
 * the top-level entry file for the resource with easy export access to all schemas.
 */
async function saveEntry(artifacts: Types.Artifacts): Promise<void> {
  for (const resource in artifacts) {
    let exports = "";
    const filepath = config.dir.json.replace("**", resource).replace("**/", "") + "index.ts";
    for (const action in artifacts[resource]) {
      exports += `export * from "./${action}/index.js";`;
    }
    const contents = utils.templates.prettier(templates.entry.replace("{{ children }}", exports), "typescript");
    await utils.filesystem.write(filepath, contents);
    utils.notification.info(`Entry for '${resource}' successfully saved.`);
  }
}

/**
 * Run all functions and generate the content and write all results to disk.
 */
const artifacts = await generateArtifacts();
await saveTypescript(artifacts);
await saveSchemas(artifacts);
await saveExporter(artifacts);
await saveEntry(artifacts);
utils.notification.success("Operation completed successfully!\n");

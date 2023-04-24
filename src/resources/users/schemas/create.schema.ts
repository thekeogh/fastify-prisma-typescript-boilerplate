import { JSONSchemaType } from "ajv";
import { RouteShorthandOptions } from "fastify";

/**
 * Request body validation
 * 
 * @see {@link https://ajv.js.org/json-schema.html AJV JSON Schema}
 */
const body: JSONSchemaType<Api.Resources.Users.Create.Body> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    name: { type: "string" },
  },
  required: ["email", "name"],
};

/**
 * Describe the response
 * 
 * @see {@link https://swagger.io/docs/specification/describing-responses/ Swagger Describing Responses}
 */
const response: JSONSchema.Response = {
  201: {
    type: "object",
    description: "User created successfully.",
    properties: {
      id: { type: "string" },
      email: { type: "string" },
      name: { type: "string" },
    },
  },
};

/**
 * Fastify schema (comprised of the above)
 */
const schema: RouteShorthandOptions = {
  schema: {
    description: "Create a user.",
    body,
    response,
  },
};

export const create = schema;
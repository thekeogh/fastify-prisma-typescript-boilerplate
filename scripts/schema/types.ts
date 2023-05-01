import { RouteShorthandOptions } from "fastify";

export type Schema = Required<Pick<RouteShorthandOptions, "schema">>;
export enum Parameter {
  Headers = "headers",
  Params = "params",
  Querystring = "querystring",
  Body = "body",
  Response = "response",
}
export type JSONSchema = import("json-schema").JSONSchema7;

export interface Content {
  json: JSONSchema;
  typescript: string;
}
export interface Code {
  [code: number]: Content;
}
export type Parameters = {
  [parameter in Parameter]?: Code | Content;
};
export interface Action {
  [action: string]: Parameters;
}
export interface Resource {
  [resource: string]: Action;
}

export type Artifacts = Resource;

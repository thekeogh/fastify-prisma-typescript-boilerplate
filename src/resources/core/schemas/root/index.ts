/**
 * The contents of this file were created automatically by `npm run generate:schema` Do not make any manual
 * modifications to this file. Instead, rerun `npm run generate:schema` and the contents of this file will be
 * regenerated.
 *
 * @remarks
 * As of the LTS version of Node 18.*.*, import assertions continue to be marked as experimental, and warnings are
 * displayed when JSON modules are imported. Due to this, we use `fs.readFile` to retrieve the contents of JSON files.
 *
 * @cli npm run generate:schema
 */

import { readFile } from "fs/promises";

import { FastifySchema } from "fastify";

export const root: { schema: FastifySchema } = JSON.parse(
  await readFile(new URL("./schema.json", import.meta.url), {
    encoding: "utf-8",
  })
);

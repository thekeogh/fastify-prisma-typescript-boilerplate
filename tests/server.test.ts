import { fastify } from "@src/server.js";

test("Should return server instance", async () => {
  expect(fastify).toBeTypeOf("object");
  await fastify.close();
});
import { faker } from "@faker-js/faker";

import { fastify } from "@src/server.js";

import { Create } from "@resources/users/controllers/index.js";

vi.mock("@resources/users/controllers/index.js");

describe("POST /v1/users", () => {

  let user: Api.Schemas.Users.Create.Response201;
  beforeEach(() => {
    user = {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      name: faker.name.fullName(),
      createdAt: faker.date.past().toString(),
      updatedAt: faker.date.recent().toString(),
    };
    vi.mocked(Create).prototype.handle.mockResolvedValue(user);
  });

  test("Returns a 400 Bad Request if name is missing", async () => {
    const response = await fastify.inject({
      method: "POST",
      path: "/v1/users",
      payload: {
        email: user.email,
      },
    });
    const { message } = response.json();
    expect(response.statusCode).toBe(400);
    expect(message).toContain("required");
    expect(message).toContain("name");
  });
  test("Returns a 400 Bad Request if email is missing", async () => {
    const response = await fastify.inject({
      method: "POST",
      path: "/v1/users",
      payload: {
        name: user.name,
      },
    });
    const { message } = response.json();
    expect(response.statusCode).toBe(400);
    expect(message).toContain("required");
    expect(message).toContain("email");
  });
  test("Returns the user object on success", async () => {
    const response = await fastify.inject({
      method: "POST",
      path: "/v1/users",
      payload: {
        email: user.email,
        name: user.name,
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(user);
  });

});
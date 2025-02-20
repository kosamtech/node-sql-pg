import request from "supertest";
import buildApp from "../../app";
import UserRepository from "../../repos/user-repo";
import Context from "../context";

let context: Context;

beforeAll(async () => {
    context = await Context.setUp();
});

afterAll(() => {
    return context.close();
});

test("should create a user", async () => {
    const startingCount = await UserRepository.count();

    await request(buildApp())
        .post("/users")
        .send({ username: "testuser", bio: "test-bio" })
        .expect(201);

    const finishCount = await UserRepository.count();
    expect(finishCount - startingCount).toEqual(1);
});

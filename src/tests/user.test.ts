import { server } from "../app";
import request from "supertest";
import Nano from "nano";

const couchdbUrl = `${process.env.COUCH_DB_URL}`;

const couch = Nano(couchdbUrl);

beforeAll(async () => {});

afterAll(async () => {
  // await couch.db.destroy("users");
  server.close();
});

const randomEmail = `${Date.now()}@mail.com`; //to skio unique email validation

const userToRegisterOK = {
  email: randomEmail,
  password: "password",
  firstName: "firstName",
  lastName: "lastName",
  role: "admin",
};

const userToRegisterBAD = {
  password: "password",
  firstName: "firstName",
  lastName: "lastName",
  role: "admin",
};

const userToLoginOK = { email: randomEmail, password: "password" };

const userToLoginBAD = { email: "email@email.com", password: "BAD PASSWORD" };

describe("user", () => {
  it("should create user", async () => {
    const res = await request(server)
      .post("/user/register")
      .send(userToRegisterOK);
    expect(res.status).toEqual(200);
    expect(res.body.user).toHaveProperty("id");
  });

  it("should return Bad Request due to no email field being sent", async () => {
    const res = await request(server)
      .post("/user/register")
      .send(userToRegisterBAD);
    expect(res.status).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should login a user", async () => {
    const res = await request(server).post("/user/login").send(userToLoginOK);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login a user due to bad credentials", async () => {
    const res = await request(server).post("/user/login").send(userToLoginBAD);
    expect(res.status).toEqual(422);
    expect(res.body.error).toBeDefined();
  });
});

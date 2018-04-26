const { users } = require("../handlers");
const { User } = require("../models");
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const axios = require("axios");

jest.unmock("axios");

let sampleUser, authAPI, baseURL, api;
beforeAll(async () => {
  baseURL = "http://localhost:3000/users";
  api = axios.create({ baseURL });
  mongoose.Promise = Promise;
  mongoose.set("debug", true);
  sampleUser = await User.create({
    username: "selenag",
    firstName: "Selena",
    lastName: "Gomez",
    password: "password",
    email: "selena@example.com"
  });
  return mongoose.connect("mongodb://localhost/linkedListTest");
});

beforeEach(async () => {
  const token = await request(app)
    .post("/users/user-auth")
    .send(sampleUser).data;
  authAPI = axios.create({ baseURL });
  authAPI.defaults.headers.common.authorization = `Bearer ${token}`;
});

describe("Test create a user", () => {
  test("Should create a new user", done => {
    request(app)
      .post("/users")
      .send({
        username: "selenaq",
        firstName: "Selena",
        lastName: "Quintanilla",
        password: "password",
        email: "comolaflor@example.com"
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });
});
describe("Test create a non-unique user", () => {
  test("Should not create a new user if username take", done => {
    request(app)
      .post("/users")
      .send({
        username: "selenag",
        firstName: "Selena",
        lastName: "Gomez",
        password: "password",
        email: "selena@example.com"
      })
      .then(response => {
        let error = JSON.parse(response.text).error;
        let errorStatus = error.status;
        expect(errorStatus).toBe(409);
        done();
      });
  });
});
describe("Read all users function", () => {
  test("Test should return all users", done => {
    request(app)
      .get("/users")
      .then(response => {
        console.log(response);

        done();
      });
  });
});

afterAll(() => {
  mongoose.connection.dropDatabase();
  app.close();
});

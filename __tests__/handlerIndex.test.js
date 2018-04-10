const { users } = require("../handlers");
const { User } = require("../models");
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(() => {
  mongoose.Promise = Promise;
  mongoose.set("debug", true);
  User.create({
    username: "selenag",
    firstName: "Selena",
    lastName: "Gomez",
    password: "password",
    email: "selena@example.com"
  });
  return mongoose.connect("mongodb://localhost/linkedListTest");
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
afterAll(() => {
  mongoose.connection.dropDatabase();
  app.close();
});

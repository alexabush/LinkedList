const { users } = require("../handlers");
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(() => {
  mongoose.Promise = Promise;
  mongoose.set("debug", true);
  return mongoose.connect("mongodb://localhost/linkedListTest");
});
describe("Test create a user", () => {
  test("Should create a new user", done => {
    request(app)
      .post("/users")
      .send({
        username: "SelinaG",
        firstName: "Selena",
        lastName: "Gomez",
        password: "password",
        email: "selena@example.com"
      })
      .then(response => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });
  test("Should create a new user", done => {
    request(app)
      .post("/users")
      .send({
        username: "SelinaG",
        firstName: "Selena",
        lastName: "Gomez",
        password: "password",
        email: "selena@example.com"
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
});
afterAll(() => {
  mongoose.connection.dropDatabase();
  app.close();
});

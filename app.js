const express = require("express");
const bodyParser = require("body-parser");
const { ApiError } = require("./helpers");

const { jobsRouter, usersRouter, companiesRouter } = require("./routers");

const app = express();

require("dotenv").load();
const SECRET = process.env.SECRET_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

app.use("/jobs", jobsRouter);
app.use("/users", usersRouter);
app.use("/companies", companiesRouter);

app.use((err, req, res, next) => {
  let apiError;
  if (!(err instanceof ApiError)) {
    apiError = new ApiError(500, "Internal Server Error", err.message);
  } else {
    apiError = err;
  }
  return res.json(apiError);
});

module.exports = app;

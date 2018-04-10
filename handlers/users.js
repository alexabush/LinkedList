const { User, Company } = require("../models");
const Validator = require("jsonschema").Validator;
const v = new Validator();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userSchema } = require("../schemas");

const { formatResponse, ApiError } = require("../helpers");

require("dotenv").load();
const SECRET_KEY = process.env.SECRET_KEY;

function userAuth(req, res, next) {
  return User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return next(new ApiError(401, "Unauthorized", "Invalid credentials."));
      }
      const isValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isValid) {
        return next(new ApiError(401, "Unauthorized", "Invalid password."));
      }
      const newToken = {
        token: jwt.sign({ username: user.username }, SECRET_KEY, {
          expiresIn: 60 * 60
        })
      };
      return res.json(formatResponse(newToken));
    })
    .catch(err => next(err));
}

function readUsers(req, res, next) {
  User.find()
    .then(users => {
      return res.status(200).json(formatResponse(users));
    })
    .catch(err => {
      return next(err);
    });
}

function createUser(req, res, next) {
  const result = v.validate(req.body, userSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  return User.createUser(new User(req.body))
    .then(newUser => res.status(201).json(formatResponse(newUser)))
    .catch(err => next(err));
}

function readUser(req, res, next) {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        return next(new ApiError(404, "Not Found Error", "Dave's not here"));
      }
      return res.status(200).json(formatResponse(user));
    })
    .catch(err => {
      return next(err);
    });
}

function updateUser(req, res, next) {
  const result = v.validate(req.body, userSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  return User.updateUser(req.params.username, req.body)
    .then(user => res.status(200).json(formatResponse(user)))
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.deleteUser(req.params.username)
    .then(() =>
      res.status(200).json({
        status: 200,
        title: "Success",
        message: "User was deleted"
      })
    )
    .catch(err => next(err));
}

module.exports = {
  userAuth,
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
};

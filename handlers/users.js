const { User } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function readUsers(req, res, next) {
  return res.json('I read all users');
}

function createUser(req, res, next) {
  return res.json('I created a user');
}

function readUser(req, res, next) {
  return res.json('I read a user');
}

function updateUser(req, res, next) {
  return res.json('I updated a user');
}

function deleteUser(req, res, next) {
  return res.json('I delete a user');
}

module.exports = {
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
};

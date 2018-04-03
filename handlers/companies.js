const { Company } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function readCompanies(req, res, next) {
  return res.json('I read all Companies');
}

function createCompany(req, res, next) {
  return res.json('I created a Company');
}

function readCompany(req, res, next) {
  return res.json('I read a Company');
}

function updateCompany(req, res, next) {
  return res.json('I updated a Company');
}

function deleteCompany(req, res, next) {
  return res.json('I delete a Company');
}

module.exports = {
  readCompanies,
  createCompany,
  readCompany,
  updateCompany,
  deleteCompany
};

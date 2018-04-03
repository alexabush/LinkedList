const { Job } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

function readJobs(req, res, next) {
  return res.json('I read all Jobs');
}

function createJob(req, res, next) {
  return res.json('I created a Job');
}

function readJob(req, res, next) {
  return res.json('I read a Job');
}

function updateJob(req, res, next) {
  return res.json('I updated a Job');
}

function deleteJob(req, res, next) {
  return res.json('I delete a Job');
}

module.exports = {
  readJobs,
  createJob,
  readJob,
  updateJob,
  deleteJob
};

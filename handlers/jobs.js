const { Job, Company } = require("../models");
const Validator = require("jsonschema").Validator;
const validator = new Validator();
const ApiError = require("../helpers/apiError");

function readJobs(req, res, next) {
  Job.find()
    .then(jobs => {
      return res.json(`All jobs: ${jobs}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

async function createJob(req, res, next) {
  const { id } = await Company.findOne({ name: req.body.company });
  req.body.company = id;
  return Job.createJob(new Job(req.body))
    .then(newJob => res.json(`I created a new job posting ${newJob}`))
    .catch(err => next(err));
}

function readJob(req, res, next) {
  Job.findById(req.params.jobId)
    .then(job => {
      if (!job) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      }
      return res.json(`job info: ${job}`);
    })
    .catch(err => {
      return next(err);
    });
}

function updateJob(req, res, next) {
  Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => {
      if (!job) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      } else {
        return res.json(`Here is your job: ${job}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

function deleteJob(req, res, next) {
  Job.deleteJob(req.params.jobId)
    .then(() => res.json(`Job posting deleted`))
    .catch(err => next(err));
}

module.exports = {
  readJobs,
  createJob,
  readJob,
  updateJob,
  deleteJob
};

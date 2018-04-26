const Validator = require("jsonschema").Validator;
const v = new Validator();
const { Job, Company } = require("../models");
const { jobSchema } = require("../schemas");
const { formatResponse, ApiError } = require("../helpers");

function readJobs(req, res, next) {
  Job.find()
    .populate("company")
    .exec()
    .then(jobs => {
      res.status(200).json(formatResponse(jobs));
    })
    .catch(err => next(err));
}

async function createJob(req, res, next) {
  const result = v.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  try {
    const { id } = await Company.findOne({ name: req.body.company });
    req.body.company = id;
    return Job.createJob(new Job(req.body))
      .then(newJob => res.status(201).json(formatResponse(newJob)))
      .catch(err => next(err));
  } catch (err) {
    return next(
      new ApiError(404, "Not Found", "Could not find requested company")
    );
  }
}

function readJob(req, res, next) {
  Job.findById(req.params.jobId)
    .then(job => {
      if (!job) {
        return next(new ApiError(404, "Not Found", "Could not find job"));
      }
      res.status(200).json(formatResponse(job));
    })
    .catch(err => next(err));
}

function updateJob(req, res, next) {
  const result = v.validate(req.body, jobSchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => {
      if (!job) {
        return next(ApiError(404, "Not Found", "Could not find job"));
      } else {
        res.status(200).json(formatResponse(job));
      }
    })
    .catch(err => next(err));
}

function deleteJob(req, res, next) {
  Job.deleteJob(req.params.jobId)
    .then(() =>
      res.status(200).json({
        status: 200,
        title: "Success",
        message: "Job was deleted"
      })
    )
    .catch(err => next(err));
}

module.exports = {
  readJobs,
  createJob,
  readJob,
  updateJob,
  deleteJob
};

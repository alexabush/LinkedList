const { Job, Company } = require("../models");
const Validator = require("jsonschema").Validator;
const validator = new Validator();
const { formatResponse, ApiError } = require("../helpers");

function readJobs(req, res, next) {
  Job.find()
    .then(jobs => {
      res.status(200).json(formatResponse(jobs));
    })
    .catch(err => {
      return next(new ApiError());
    });
}

async function createJob(req, res, next) {
  try {
    const { id } = await Company.findOne({ name: req.body.company });
    req.body.company = id;
    return Job.createJob(new Job(req.body))
      .then(newJob => res.status(201).json(formatResponse(newJob)))
      .catch(err =>
        next(
          new ApiError(
            500,
            "Internal Server Error",
            "Something went wrong creating the new job"
          )
        )
      );
  } catch (err) {
    return next(
      new ApiError(404, "Not Found Error", "Could not find requested company")
    );
  }
}

function readJob(req, res, next) {
  Job.findById(req.params.jobId)
    .then(job => {
      if (!job) {
        return next(new ApiError(404, "Not Found Error", "Could not find job"));
      }
      res.status(200).json(formatResponse(job));
    })
    .catch(err => {
      return next(err);
    });
}

function updateJob(req, res, next) {
  Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => {
      if (!job) {
        return next(ApiError(404, "Not Found Error", "Could not find job"));
      } else {
        res.status(200).json(formatResponse(job));
      }
    })
    .catch(err => {
      return next(err);
    });
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

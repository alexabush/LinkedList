const { Job } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const ApiError = require('../helpers/apiError');

function readJobs(req, res, next) {
  Job.find()
    .then(jobs => {
      return res.json(`All jobs: ${jobs}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function createJob(req, res, next) {
  Job.create(req.body)
    .then(job => {
      return res.json(`I created a job ${job}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function readJob(req, res, next) {
  Job.findById(req.params.jobId)
    .then(job => {
      if (!job) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      }
      return res.json(`job info: ${job}`);
    })
    .catch(err => {
      return next(err);
    });
}
////////////////////////////////////////////////////
//We'll need to update this to service the full scope of job information
//currently we only update the information that the job provides
//when they sign up
////////////////////////////////////////////////////

function updateJob(req, res, next) {
  Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    .then(job => {
      if (!job) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      } else {
        return res.json(`Here is your job: ${job}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

////////////////////////////////////////////////////
//We will need to remove the current job from the
//company.employees's array
////////////////////////////////////////////////////
function deleteJob(req, res, next) {
  Job.findByIdAndRemove(req.params.jobId)
    .then(job => {
      if (!job) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      } else {
        return res.json(`job deleted: ${job}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

module.exports = {
  readJobs,
  createJob,
  readJob,
  updateJob,
  deleteJob
};

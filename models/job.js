const mongoose = require('mongoose');
const Company = require('./company');
const { formatResponse, ApiError } = require('../helpers');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: 'Required Value' },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: 'Required Value'
    },
    salary: Number,
    equity: Number
  },
  { timestamp: true }
);

jobSchema.statics = {
  createJob(newJob) {
    return newJob
      .save()
      .then(job => {
        return Company.findByIdAndUpdate(job.company, {
          $addToSet: { jobs: job.id }
        })
          .then(job => {
            console.log('Company job list updated!');
            return job;
          })
          .catch(err =>
            Promise.reject(
              new ApiError(
                404,
                'Not Found Error',
                'Could not find requested company'
              )
            )
          );
      })
      .catch(err => {
        return Promise.reject(
          new ApiError(
            500,
            'Internal Server Error',
            'Something went wrong saving the new job to the database'
          )
        );
      });
  },
  deleteJob(jobId) {
    return this.findByIdAndRemove(jobId)
      .then(job => {
        return Company.findByIdAndUpdate(job.company, {
          $pull: { jobs: job.id }
        })
          .then(job => {
            console.log('Job removed from company jobs list');
            return job;
          })
          .catch(err =>
            Promise.reject(
              new ApiError(
                500,
                'Internal Server Error',
                'Something went wrong updating the database'
              )
            )
          );
      })
      .catch(err =>
        Promise.reject(
          new ApiError(404, 'Not Found Error', 'Could not find job in database')
        )
      );
  }
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

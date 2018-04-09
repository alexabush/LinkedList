const mongoose = require("mongoose");
const Company = require("./company");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: "Required Value" },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: "Required Value"
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
          .then(() => {
            console.log("Company job list updated!");
            return job;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  deleteJob(jobId) {
    return this.findByIdAndRemove(jobId)
      .then(job => {
        return Company.findByIdAndUpdate(job.company, {
          $pull: { jobs: job.id }
        })
          .then(() => {
            console.log("Job removed from company jobs list");
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

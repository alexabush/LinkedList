const express = require("express");
const router = express.Router();
const {
  userAuthRequired,
  companyAuthRequired,
  ensureCorrectCompany
} = require("../helpers");

const { jobs } = require("../handlers");

router
  .route("")
  .get(userAuthRequired, jobs.readJobs)
  .post(companyAuthRequired, jobs.createJob);

router
  .route("/:jobId")
  .get(userAuthRequired, jobs.readJob)
  .patch(companyAuthRequired, ensureCorrectCompany, jobs.updateJob)
  .delete(companyAuthRequired, ensureCorrectCompany, jobs.deleteJob);

module.exports = router;

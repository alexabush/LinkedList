const express = require('express');
const router = express.Router();
const {
  companyAuthRequired,
  userAuthRequired,
  ensureCorrectUser
} = require('../helpers');

const { jobs } = require('../handlers');

router
  .route('')
  .get(userAuthRequired, jobs.readJobs)
  .post(companyAuthRequired, jobs.createJob);

router
  .route('/:jobId')
  .get(userAuthRequired, jobs.readJob)
  .patch(companyAuthRequired, ensureCorrectJob, jobs.updateJob)
  .delete(companyAuthRequired, jobs.deleteJob);

module.exports = router;

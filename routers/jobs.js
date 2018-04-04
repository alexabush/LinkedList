const express = require('express');
const router = express.Router();

const { jobs } = require('../handlers');

router
  .route('')
  .get(jobs.readJobs)
  .post(jobs.createJob);

router
  .route('/:jobId')
  .get(jobs.readJob)
  .patch(jobs.updateJob)
  .delete(jobs.deleteJob);

module.exports = router;

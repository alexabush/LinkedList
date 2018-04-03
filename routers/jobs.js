const express = require('express');
const router = express.Router();

const { Jobs } = require('../handlers');

router
  .route('')
  .get(Jobs.readJobs)
  .post(Jobs.createJob);

router
  .route('/:JobId')
  .get(Jobs.readJob)
  .patch(Jobs.updateJob)
  .delete(Jobs.deleteJob);

module.exports = router;

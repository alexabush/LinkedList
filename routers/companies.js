const express = require('express');
const router = express.Router();

const { companies } = require('../handlers');

router
  .route('')
  .get(companies.readCompanies)
  .post(companies.createCompany);

router
  .route('/:handle')
  .get(companies.readCompany)
  .patch(companies.updateCompany)
  .delete(companies.deleteCompany);

module.exports = router;

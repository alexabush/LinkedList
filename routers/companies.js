const express = require('express');
const router = express.Router();
const {
  companyAuthRequired,
  userAuthRequired,
  ensureCorrectUser,
  ensureCorrectCompany
} = require('../helpers');
const { companies } = require('../handlers');

router
  .route('')
  //this one is weird, we'll need to test for
  //EITHER company OR user
  .get(companies.readCompanies)
  .post(companies.createCompany);

router
  .route('/:handle')
  .get(userAuthRequired, companies.readCompany)
  .patch(companyAuthRequired, ensureCorrectCompany, companies.updateCompany)
  .delete(companyAuthRequired, ensureCorrectCompany, companies.deleteCompany);

module.exports = router;

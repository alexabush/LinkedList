const express = require('express');
const router = express.Router();

const { Companies } = require('../handlers');

router
  .route('')
  .get(Companies.readCompanys)
  .post(Companies.createCompany);

router
  .route('/:CompanyId')
  .get(Companies.readCompany)
  .patch(Companies.updateCompany)
  .delete(Companies.deleteCompany);

module.exports = router;

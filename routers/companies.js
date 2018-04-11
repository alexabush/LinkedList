const express = require("express");
const router = express.Router();
const {
  userAuthRequired,
  companyAuthRequired,
  generalAuthRequired,
  ensureCorrectCompany
} = require("../helpers");
const { companies } = require("../handlers");

router.post("/company-auth", companies.companyAuth);

router
  .route("")
  .get(generalAuthRequired, companies.readCompanies)
  .post(companies.createCompany);

router
  .route("/:handle")
  .get(userAuthRequired, companies.readCompany)
  .patch(companyAuthRequired, ensureCorrectCompany, companies.updateCompany)
  .delete(companyAuthRequired, ensureCorrectCompany, companies.deleteCompany);

module.exports = router;

const Validator = require("jsonschema").Validator;
const v = new Validator();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Company } = require("../models");
const { newCompanySchema, updateCompanySchema } = require("../schemas");
const { formatResponse, ApiError } = require("../helpers");

require("dotenv").load();
const SECRET_KEY = process.env.SECRET_KEY;

function companyAuth(req, res, next) {
  return Company.findOne({ handle: req.body.handle })
    .then(company => {
      if (!company) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const isValid = bcrypt.compareSync(req.body.password, company.password);
      if (!isValid) {
        return next(
          new ApiError(401, "Unauthorized", "Invalid handle or password.")
        );
      }
      const newToken = {
        token: jwt.sign({ handle: company.handle }, SECRET_KEY, {
          expiresIn: 60 * 60
        })
      };
      return res.json(formatResponse(newToken));
    })
    .catch(err => next(err));
}

function readCompanies(req, res, next) {
  Company.find()
    .then(companies => res.status(200).json(formatResponse(companies)))
    .catch(err => next(err));
}

function createCompany(req, res, next) {
  const result = v.validate(req.body, newCompanySchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  return Company.createCompany(new Company(req.body))
    .then(newCompany => res.status(201).json(formatResponse(newCompany)))
    .catch(err => next(err));
}

function readCompany(req, res, next) {
  Company.findOne({ handle: req.params.handle })
    .then(company => {
      if (!company)
        return next(new ApiError(404, "Not Found", "Dave's not here"));
      return res.status(200).json(formatResponse(company));
    })
    .catch(err => next(err));
}

function updateCompany(req, res, next) {
  const result = v.validate(req.body, updateCompanySchema);
  if (!result.valid) {
    const errors = result.errors.map(e => e.message).join(", ");
    return next({ message: errors });
  }
  delete req.body.handle;
  Company.findOneAndUpdate({ handle: req.params.handle }, req.body, {
    new: true
  })
    .then(company => {
      if (!company) {
        return next(new ApiError(404, "Not Found", "Dave's not here"));
      } else {
        return res.status(200).json(formatResponse(company));
      }
    })
    .catch(err => next(err));
}

function deleteCompany(req, res, next) {
  Company.deleteCompany(req.params.handle)
    .then(() =>
      res.status(200).json({
        status: 200,
        title: "Success",
        message: "Company was deleted"
      })
    )
    .catch(err => next(err));
}

module.exports = {
  companyAuth,
  readCompanies,
  createCompany,
  readCompany,
  updateCompany,
  deleteCompany
};

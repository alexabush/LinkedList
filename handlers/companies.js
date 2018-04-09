const { Company } = require("../models");
const Validator = require("jsonschema").Validator;
const validator = new Validator();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { formatResponse, ApiError } = require("../helpers");

const SECRET_KEY = "apaulag";

function companyAuth(req, res, next) {
  return Company.findOne({ handle: req.body.handle })
    .then(company => {
      if (!company) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const isValid = bcrypt.compareSync(req.body.password, company.password);
      if (!isValid) {
        throw new ApiError(401, "Unauthorized", "Invalid handle or password.");
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
    .then(companies => res.status(201).json(formatResponse(companies)))
    .catch(err => next(new ApiError()));
}

function createCompany(req, res, next) {
  return Company.createCompany(new Company(req.body))
    .then(newCompany => res.status(201).json(formatResponse(newCompany)))
    .catch(err => next(err));
}

function readCompany(req, res, next) {
  Company.findOne({ handle: req.params.handle })
    .then(company => {
      if (!company) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      }
      return res.status(201).json(formatResponse(company));
    })
    .catch(err => {
      return next(err);
    });
}

function updateCompany(req, res, next) {
  delete req.body.handle;
  Company.findOneAndUpdate({ handle: req.params.handle }, req.body, {
    new: true
  })
    .then(company => {
      if (!company) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      } else {
        return res.status(201).json(formatResponse(company));
      }
    })
    .catch(err => {
      return next(err);
    });
}

function deleteCompany(req, res, next) {
  Company.deleteCompany(req.params.handle)
    .then(company => res.status(201).json(formatResponse(company)))
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

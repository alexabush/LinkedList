const { Company } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { formatResponse, ApiError } = require('../helpers');

const SECRET_KEY = 'apaulag';

function companyAuth(req, res, next) {
  return Company.findOne({ handle: req.body.handle })
    .then(company => {
      console.log(`THIS IS COMPANY ${company}`);
      if (!company) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      const isValid = bcrypt.compareSync(req.body.password, company.password);
      console.log('IS VALID', isValid);
      if (!isValid) {
        throw new ApiError(401, 'Unauthorized', 'Invalid handle.');
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
    .then(companies => {
      return res.json(`All companies: ${companies}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function createCompany(req, res, next) {
  return Company.createCompany(new Company(req.body))
    .then(newCompany => {
      return res.status(201).json(formatResponse(newCompany));
    })
    .catch(err => {
      return next(err);
    });
}

function readCompany(req, res, next) {
  Company.findOne({ handle: req.params.handle })
    .then(company => {
      if (!company) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      }
      return res.json(`company info: ${company}`);
    })
    .catch(err => {
      return next(err);
    });
}

function updateCompany(req, res, next) {
  Company.findOneAndUpdate({ handle: req.params.handle }, req.body, {
    new: true
  })
    .then(company => {
      if (!company) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      } else {
        return res.json(`Here is your company: ${company}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

function deleteCompany(req, res, next) {
  Company.deleteCompany(req.params.handle)
    .then(() => res.json('Company deleted'))
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

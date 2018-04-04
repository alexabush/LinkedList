const { Company } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const ApiError = require('../helpers/apiError');

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
  Company.create(req.body)
    .then(company => {
      return res.json(`I created a company ${company}`);
    })
    .catch(err => {
      return next(new ApiError());
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
////////////////////////////////////////////////////
//We'll need to update this to service the full scope of company information
//currently we only update the information that the company provides
//when they sign up
////////////////////////////////////////////////////

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

////////////////////////////////////////////////////
//We will need to remove the current company from the
//company.employees's array
////////////////////////////////////////////////////
function deleteCompany(req, res, next) {
  Company.findOneAndRemove({ handle: req.params.handle })
    .then(company => {
      if (!company) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      } else {
        return res.json(`company deleted: ${company}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

module.exports = {
  readCompanies,
  createCompany,
  readCompany,
  updateCompany,
  deleteCompany
};

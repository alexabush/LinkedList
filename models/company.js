const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Required Value' },
    email: { type: String, required: 'Required Value' },
    handle: { type: String, required: 'Required Value' },
    password: { type: String, required: 'Required Value' },
    logo: String,
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]
  },
  { timestamp: true }
);

companySchema.statics = {
  createCompany(newCompany) {
    return this.findOne({ handle: newCompany.handle })
      .then(company => {
        if (company) {
          throw new ApiError(
            409,
            'Company already exists',
            `The handle ${company.handle} already exists`
          );
        }
        return newCompany
          .save()
          .then(company => company)
          .catch(err => {
            return Promise.reject(err);
          });
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  checkPassword(candidatePassword, next) {
    return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      return next(null, isMatch);
    });
  },
  deleteCompany(handle) {
    return this.findOneAndRemove({ handle: handle })
      .then(company => {
        return mongoose
          .model('Job')
          .remove({ company: company.id })
          .then(() => {
            console.log('Jobs removed');
            return mongoose
              .model('User')
              .update(
                { currentCompanyId: company.id },
                { $set: { currentCompanyId: null } },
                { multi: true }
              )
              .then(() => {
                console.log('Company id removed from users');
              })
              .catch(err => Promise.reject(err));
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

companySchema.pre('save', function(monNext) {
  if (!this.isModified('password')) {
    return monNext();
  }
  return bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      return monNext();
    })
    .catch(err => monNext(err));
});

companySchema.pre('findOneAndUpdate', function(monNext) {
  const password = this.getUpdate().password;
  if (!password) {
    return monNext();
  }
  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    this.getUpdate().password = hash;
    return monNext();
  } catch (error) {
    return monNext(error);
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

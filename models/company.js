const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    handle: String,
    password: String,
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

const company = mongoose.model('company', companySchema);

module.exports = company;

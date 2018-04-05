const mongoose = require('mongoose');

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

const company = mongoose.model('company', companySchema);

module.exports = company;

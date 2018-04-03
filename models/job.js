const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    salary: Number
  },
  { timestamp: true }
);

const job = mongoose.model('job', jobSchema);

module.exports = job;

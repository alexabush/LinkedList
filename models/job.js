const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    salary: Number,
    //equity should be a float. should be expressed as a percentage
    equity: Number
  },
  { timestamp: true }
);

const job = mongoose.model('job', jobSchema);

module.exports = job;

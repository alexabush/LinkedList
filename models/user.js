const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    currentCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    photo: String,
    experience: [
      {
        jobTitle: String,
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company'
        },
        startDate: String,
        endDate: String
      }
    ],
    education: [
      {
        institution: String,
        degree: String,
        endDate: String
      }
    ],
    skills: []
  },
  { timestamp: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

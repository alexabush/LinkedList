const mongoose = require("mongoose");
const Company = require("./company");

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    currentCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    // TODO: Handle edge case in which user links to company that doesn't exist
    // currentCompanyAlt: String,
    photo: String,
    experience: [
      {
        jobTitle: String,
        company: String,
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

userSchema.post("findOneAndUpdate", user => {
  Company.findByIdAndUpdate(
    user.currentCompany,
    {
      $addToSet: { employees: user.id }
    },
    {
      new: true
    }
  ).then(() => {
    console.log("Patch Post Hook Ran");
  });
});

userSchema.post("findOneAndRemove", user => {
  Company.findByIdAndUpdate(
    user.currentCompany,
    {
      $pull: { employees: user.id }
    },
    {
      new: true
    }
  ).then(() => {
    console.log("Delete Post Hook Ran");
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;

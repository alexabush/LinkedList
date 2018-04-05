const mongoose = require("mongoose");
const Company = require("./company");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: "Value Required" },
    lastName: { type: String, required: "Value Required" },
    username: { type: String, required: "Value Required" },
    email: { type: String, required: "Value Required" },
    password: { type: String, required: "Value Required" },
    currentCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    currentCompanyName: String,
    photo: String,
    experience: [
      {
        jobTitle: String,
        companyName: String,
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company"
        },
        startDate: Date,
        endDate: Date
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
  if (user.currentCompanyId) {
    Company.findByIdAndUpdate(
      user.currentCompanyId,
      {
        $addToSet: { employees: user.id }
      },
      {
        new: true
      }
    ).then(() => {
      console.log("Patch Post Hook Ran");
    });
  }
});

userSchema.post("findOneAndRemove", user => {
  if (user.currentCompanyId) {
    Company.findByIdAndUpdate(
      user.currentCompanyId,
      {
        $pull: { employees: user.id }
      },
      {
        new: true
      }
    ).then(() => {
      console.log("Delete Post Hook Ran");
    });
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

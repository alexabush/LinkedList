const mongoose = require("mongoose");
const Company = require("./company");
const ApiError = require("../helpers/ApiError");

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

userSchema.statics = {
  createUser(newUser) {
    return this.findOne({ username: newUser.username })
      .then(user => {
        if (user) {
          throw new Error(`The username ${user.username} already exists`);
        }
        return newUser
          .save()
          .then(user => user)
          .catch(err => {
            return Promise.reject(err);
          });
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  updateUser(username, userData) {
    return this.findOneAndUpdate({ username: username }, userData, {
      new: true
    })
      .then(user => {
        if (!user) {
          throw new Error(`This username does not exist`);
        }
        if (user.currentCompanyId) {
          return Company.findByIdAndUpdate(user.currentCompanyId, {
            $addToSet: { employees: user.id }
          })
            .then(() => {
              console.log("Company employee list updated!");
              return user;
            })
            .catch(err => Promise.reject(err));
        } else {
          return user;
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
  // deleteUser(userId) {
  //   return this.findOneAndRemove(userId)
  //     .then(user => {
  //       return Company.findOneAndUpdate(
  //         user.currentCompanyId,
  //         {
  //           $pull: { employees: user._id }
  //         },
  //         { new: true }
  //       )
  //         .then(() => {
  //           console.log("POST HOOK RAN");
  //         })
  //         .catch(err => Promise.reject(err));
  //     })
  //     .catch(err => Promise.reject(err));
  // }
};

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

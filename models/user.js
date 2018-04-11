const mongoose = require("mongoose");
const Company = require("./company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../helpers");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: "Value Required" },
    lastName: { type: String, required: "Value Required" },
    username: { type: String, required: "Value Required", unique: true },
    email: { type: String, required: "Value Required", unique: true },
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
        endDate: Date
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
          throw new ApiError(
            409,
            "User already exists",
            `The username ${user.username} already exists`
          );
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
  async updateUser(username, reqBody) {
    //prevents user from changing the username
    delete reqBody.username;
    let user = null;
    try {
      user = await this.findOne({ username: username });
      if (!user) {
        throw new ApiError(404, "Not Found", "Dave's not here");
      }
    } catch (err) {
      return Promise.reject(err);
    }

    if (reqBody.currentCompanyName || reqBody.currentCompanyName === "") {
      if (user.currentCompanyId) {
        try {
          await Company.findByIdAndUpdate(user.currentCompanyId, {
            $pull: { employees: user.id }
          });
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }

    if (reqBody.currentCompanyName) {
      try {
        //separate findOne and update functions
        const { id } = await Company.findOneAndUpdate(
          { name: reqBody.currentCompanyName },
          { $addToSet: { employees: user.id } }
        );
        reqBody.currentCompanyId = id;
      } catch (err) {
        reqBody.currentCompanyId = null;
      }
    }

    try {
      return await User.findOneAndUpdate({ username: username }, reqBody, {
        new: true
      });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  checkPassword(candidatePassword, next) {
    return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      return next(null, isMatch);
    });
  },
  deleteUser(username) {
    return this.findOneAndRemove({ username: username })
      .then(user => {
        if (!user) {
          throw new ApiError(404, "Not Found", "Dave's not here");
        }
        if (user.currentCompanyId)
          return Company.findByIdAndUpdate(
            user.currentCompanyId,
            {
              $pull: { employees: user.id }
            },
            { new: true }
          )
            .then(() => {
              return user;
            })
            .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  }
};

userSchema.pre("save", function(monNext) {
  if (!this.isModified("password")) {
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

userSchema.pre("findOneAndUpdate", function(monNext) {
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

const User = mongoose.model("User", userSchema);

module.exports = User;

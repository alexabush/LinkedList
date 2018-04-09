const mongoose = require("mongoose");
const Company = require("./company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongooseImmutable = require("mongoose-immutable");

const { ApiError } = require("../helpers");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: "Value Required" },
    lastName: { type: String, required: "Value Required" },
    username: { type: String, required: "Value Required", immutable: true },
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
  updateUser(username, reqBody) {
    return this.findOne({ username: username }).then(async user => {
      if (!user) {
        throw new ApiError(404, "Not Found Error", "This user does not exist");
      }

      if (reqBody.currentCompanyName) {
        if (user.currentCompanyId) {
          await Company.findByIdAndUpdate(user.currentCompanyId, {
            $pull: { employees: user.id }
          });
        }
        try {
          const { id } = await Company.findOneAndUpdate(
            { name: reqBody.currentCompanyName },
            { $addToSet: { employees: user.id } }
          );
          reqBody.currentCompanyId = id;
        } catch (err) {
          reqBody.currentCompanyId = null;
        }
      }

      return User.findOneAndUpdate({ username: username }, reqBody, {
        new: true
      })
        .then(user => {
          return user;
        })
        .catch(err => Promise.reject(err));
    });
  },
  checkPassword(candidatePassword, next) {
    return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      return next(null, isMatch);
    });
  }
  // INTENTION TO MOVE THE POST HOOK LOGIC INTO STATIC
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

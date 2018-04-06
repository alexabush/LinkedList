const mongoose = require('mongoose');
const Company = require('./company');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: "Value Required" },
    lastName: { type: String, required: "Value Required" },
    username: { type: String, required: "Value Required" },
    email: { type: String, required: "Value Required" },
    password: { type: String, required: "Value Required" },
    currentCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
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

<<<<<<< HEAD
userSchema.post('findOneAndUpdate', user => {
  Company.findByIdAndUpdate(
    user.currentCompany,
    {
      $addToSet: { employees: user.id }
    },
    {
      new: true
    }
  ).then(() => {
    console.log('Patch Post Hook Ran');
  });
});

userSchema.post('findOneAndRemove', user => {
  Company.findByIdAndUpdate(
    user.currentCompany,
    {
      $pull: { employees: user.id }
    },
    {
      new: true
    }
  ).then(() => {
    console.log('Delete Post Hook Ran');
  });
=======
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
  },
  checkPassword(candidatePassword, next) {
    // when this method is called, compare the plain text password with the password in the database.
    return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      // isMatch is a boolean which we will pass to our next function
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
    .hash(this.password, SALT_WORK_FACTOR)
    .then(hash => {
      this.password = hash;
      return monNext();
    })
    .catch(err => next(err));
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
    return next(error);
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
>>>>>>> 16e784cd22523d8c2b7282276fd2ee39af3e4e7c
});

const User = mongoose.model('User', userSchema);

module.exports = User;

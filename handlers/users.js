const { User } = require("../models");
const Validator = require("jsonschema").Validator;
const validator = new Validator();
const ApiError = require("../helpers/ApiError");
const { Company } = require("../models");

function readUsers(req, res, next) {
  User.find()
    .then(users => {
      return res.json(`All users: ${users}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function createUser(req, res, next) {
  return User.createUser(new User(req.body))
    .then(newUser => res.json(`I created a user ${newUser}`))
    .catch(err => next(err));
}

function readUser(req, res, next) {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      }
      return res.json(`User info: ${user}`);
    })
    .catch(err => {
      return next(err);
    });
}

async function updateUser(req, res, next) {
  const userData = req.body;
  if (userData.currentCompanyName) {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      const error = new ApiError(404, "user not found", "User not found");
      console.log(error);
      return next(error);
    }
    if (user.currentCompanyId) {
      await Company.findByIdAndUpdate(user.currentCompanyId, {
        $pull: { employees: user.id }
      });
    }
    try {
      const { id } = await Company.findOne({
        name: userData.currentCompanyName
      });
      userData.currentCompanyId = id;
    } catch (err) {
      userData.currentCompanyId = null;
    }
  }

  return User.updateUser(req.params.username, userData)
    .then(user => res.json(`Here is your user: ${user}`))
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.findOneAndRemove({ username: req.params.username })
    .then(user => {
      if (!user) {
        throw new ApiError(404, "Not Found Error", "Dave's not here");
      } else {
        return res.json(`User deleted: ${user}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

module.exports = {
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
};

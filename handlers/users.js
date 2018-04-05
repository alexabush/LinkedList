const { User } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const ApiError = require('../helpers/apiError');
const { Company } = require('../models');

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
  User.create(req.body)
    .then(user => {
      return res.json(`I created a user ${user}`);
    })
    .catch(err => {
      return next(new ApiError());
    });
}

function readUser(req, res, next) {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      }
      return res.json(`User info: ${user}`);
    })
    .catch(err => {
      return next(err);
    });
}
////////////////////////////////////////////////////
//We'll need to update this to service the full scope of user information
//currently we only update the information that the user provides
//when they sign up
//
//We need to account for:
//
////////////////////////////////////////////////////

async function updateUser(req, res, next) {
  const userData = req.body;

  if (userData.currentCompany) {
    const { id } = await Company.findOne({ name: userData.currentCompany });
    userData.currentCompany = id;
  }

  User.findOneAndUpdate({ username: req.params.username }, userData, {
    new: true
  })
    .then(user => {
      if (!user) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      } else {
        return res.json(`Here is your user: ${user}`);
      }
    })
    .catch(err => {
      return next(err);
    });
}

////////////////////////////////////////////////////
//We will need to remove the current user from the
//company.employees's array
////////////////////////////////////////////////////
function deleteUser(req, res, next) {
  User.findOneAndRemove({ username: req.params.username })
    .then(user => {
      if (!user) {
        throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
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

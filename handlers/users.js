const { User } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const ApiError = require('../helpers/apiError');

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
  User.findById(req.params.userId)
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
////////////////////////////////////////////////////

function updateUser(req, res, next) {
  User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
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
  User.findByIdAndRemove(req.params.userId)
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

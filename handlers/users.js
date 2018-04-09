const { User, Company } = require('../models');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { formatResponse, ApiError } = require('../helpers');

const SECRET_KEY = 'apaulag';

function userAuth(req, res, next) {
  return User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        throw new ApiError(401, 'Unauthorized', 'Invalid credentials.');
      }
      const isValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isValid) {
        throw new ApiError(401, 'Unauthorized', 'Invalid password.');
      }
      const newToken = {
        token: jwt.sign({ username: user.username }, SECRET_KEY, {
          expiresIn: 60 * 60
        })
      };
      return res.json(formatResponse(newToken));
    })
    .catch(err => next(err));
}

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
    .then(newUser => res.status(201).json(formatResponse(newUser)))
    .catch(err => next(err));
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

async function updateUser(req, res, next) {
  const newUserData = req.body;
  //is there a way to include all code in one try-catch block?
  // || newUserData.currentCompanyName === '' //need to add code to deal with empty string submission
  if (newUserData.currentCompanyName) {
    //does this need to be in a try/catch?
    const savedUser = await User.findOne({ username: req.params.username });
    if (!savedUser) {
      const error = new ApiError(404, 'Not Found Error', 'Dave\'s not here');
      return next(error);
    }
    if (savedUser.currentCompanyId) {
      //does this need to be in a try/catch?
      const savedCompany = await Company.findByIdAndUpdate(
        savedUser.currentCompanyId,
        {
          $pull: { employees: savedUser.id }
        }
      );
    }
    try {
      const { id } = await Company.findOne({
        name: newUserData.currentCompanyName
      });
      newUserData.currentCompanyId = id;
    } catch (err) {
      newUserData.currentCompanyId = null;
    }
    //adds user id to company's employee array
    //does this need to be in try/catch block?
    await Company.findByIdAndUpdate(newUserData.currentCompanyId, {
      $addToSet: { employees: savedUser.id }
    });
  }
  //refactored to use async await
  /*
    finds user in db and adds or modifies user data according to the req.body
  */
  try {
    const newUser = await User.findOneAndUpdate(
      { username: req.params.username },
      newUserData,
      {
        new: true
      }
    );
    if (!newUser) {
      throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
    } else {
      return res.json(`Here is your user: ${newUser}`);
    }
  } catch (err) {
    return next(err);
  }
  // return User.findOneAndUpdate({ username: req.params.username }, userData, {
  //   new: true
  // })
  //   .then(user => {
  //     if (!user) {
  //       throw new ApiError(404, 'Not Found Error', 'Dave\'s not here');
  //     } else {
  //       return res.json(`Here is your user: ${user}`);
  //     }
  //   })
  //   .catch(err => {
  //     return next(err);
  //   });
}

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
  userAuth,
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
};

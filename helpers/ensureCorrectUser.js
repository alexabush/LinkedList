const jwt = require('jsonwebtoken');
const { APIError } = require('../helpers');
const SECRET_KEY = 'apaulag';

function ensureCorrectUser(req, res, next) {
  try {
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
      if (decoded.username === req.params.username) {
        return next();
      } else {
        return next(new APIError(401, 'Unauthorized', 'Invalid auth token.'));
      }
    });
  } catch (err) {
    return next(new APIError(401, 'Unauthorized', 'Missing auth token.'));
  }
}

module.exports = ensureCorrectUser;

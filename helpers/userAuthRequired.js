const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers');
const SECRET_KEY = 'apaulag';
var jwtDecode = require('jwt-decode');

function userAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY);
    const decoded = jwtDecode(token);
    console.log('I RAN');

    console.log('DECODED', decoded);
    if (!decoded.username) {
      return next(
        new ApiError(401, 'Unauthorized', 'Missing or invalid auth token.')
      );
    }
    return next();
  } catch (err) {
    console.log('I AM AN ERROR');
    return next(
      new ApiError(401, 'Unauthorized', 'Missing or invalid auth token.')
    );
  }
}

module.exports = userAuthRequired;

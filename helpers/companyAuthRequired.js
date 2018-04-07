const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers');
const SECRET_KEY = 'apaulag';
var jwtDecode = require('jwt-decode');

function companyAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY);
    const decoded = jwtDecode(token);
    console.log(decoded);
    // if (!decoded.handle === req.params.handle) {
    if (!decoded.handle) {
      new ApiError(401, 'Unauthorized', 'Missing or invalid auth token.');
    }
    return next();
  } catch (err) {
    return next(
      new ApiError(401, 'Unauthorized', 'Missing or invalid auth token.')
    );
  }
}

module.exports = companyAuthRequired;

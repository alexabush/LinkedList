const jwt = require('jsonwebtoken');
const { APIError } = require('../helpers');
const SECRET_KEY = 'apaulag';

async function userAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const returnedObj = await jwt.verify(token, SECRET_KEY);
    //check for payload, see if user or company
    return next();
  } catch (err) {
    return next(
      new APIError(401, 'Unauthorized', 'Missing or invalid auth token.')
    );
  }
}

module.exports = userAuthRequired;

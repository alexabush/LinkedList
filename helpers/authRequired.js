const jwt = require("jsonwebtoken");
const { APIError } = require("../helpers");
const SECRET_KEY = "apaulag";

function userAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY);
    return next();
  } catch (err) {
    return next(
      new APIError(401, "Unauthorized", "Missing or invalid auth token.")
    );
  }
}

module.exports = userAuthRequired;

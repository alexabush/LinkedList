const jwt = require("jsonwebtoken");
const { ApiError } = require("../helpers");
const SECRET_KEY = "apaulag";

function companyAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY);
    return next();
  } catch (err) {
    return next(
      new ApiError(401, "Unauthorized", "Missing or invalid auth token.")
    );
  }
}

module.exports = companyAuthRequired;

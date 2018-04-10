const jwt = require("jsonwebtoken");
const { ApiError } = require("../helpers");
require("dotenv").load();
const SECRET_KEY = process.env.SECRET_KEY;

function generalAuthRequired(request, response, next) {
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

module.exports = generalAuthRequired;

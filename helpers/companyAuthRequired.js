const jwt = require("jsonwebtoken");
const { ApiError } = require("../helpers");
require("dotenv").load();
const SECRET = process.env.SECRET_KEY;
var jwtDecode = require("jwt-decode");

function companyAuthRequired(request, response, next) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY);
    const decoded = jwtDecode(token);
    if (!decoded.handle) {
      return next(
        new ApiError(401, "Unauthorized", "Missing or invalid auth token.")
      );
    }
    return next();
  } catch (err) {
    return next(
      new ApiError(401, "Unauthorized", "Missing or invalid auth token.")
    );
  }
}

module.exports = companyAuthRequired;

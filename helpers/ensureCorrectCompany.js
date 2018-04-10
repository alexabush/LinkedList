const jwt = require("jsonwebtoken");
const { ApiError } = require("../helpers");
require("dotenv").load();
const SECRET = process.env.SECRET_KEY;
const { Company, Job } = require("../models");

function ensureCorrectCompany(req, res, next) {
  try {
    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async function(err, decoded) {
      if (decoded.handle === req.params.handle) {
        return next();
      }
      const jobId = req.params.jobId;
      try {
        const job = await Job.findById(jobId);
        const { handle } = await Company.findById(job.company);
        if (decoded.handle === handle) {
          return next();
        } else {
          return next(new ApiError(401, "Unauthorized", "Invalid auth token."));
        }
      } catch (err) {
        return next(new ApiError(401, "Unauthorized", "Invalid auth token."));
      }
    });
  } catch (err) {
    return next(new ApiError(401, "Unauthorized", "Missing auth token."));
  }
}

module.exports = ensureCorrectCompany;

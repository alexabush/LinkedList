const express = require("express");
const router = express.Router();
const { userAuthRequired, ensureCorrectUser } = require("../helpers");
const { users } = require("../handlers");

router.post("/user-auth", users.userAuth);

router
  .route("")
  .get(userAuthRequired, users.readUsers)
  .post(users.createUser);

router
  .route("/:username")
  .get(userAuthRequired, users.readUser)
  .patch(userAuthRequired, ensureCorrectUser, users.updateUser)
  .delete(userAuthRequired, ensureCorrectUser, users.deleteUser);

module.exports = router;

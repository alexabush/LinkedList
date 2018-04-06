const express = require("express");
const router = express.Router();
const { authRequired, ensureCorrectUser } = require("../helpers");
const { users } = require("../handlers");

router
  .route("")
  .get(authRequired, users.readUsers)
  .post(users.createUser);

router.post("/user-auth", users.userAuth);
router
  .route("/:username")
  .get(authRequired, users.readUser)
  .patch(authRequired, ensureCorrectUser, users.updateUser)
  .delete(authRequired, ensureCorrectUser, users.deleteUser);

module.exports = router;

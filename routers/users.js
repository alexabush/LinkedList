const express = require('express');
const router = express.Router();

const { users } = require('../handlers');

router
  .route('')
  .get(users.readUsers)
  .post(users.createUser);

router
  .route('/:username')
  .get(users.readUser)
  .patch(users.updateUser)
  .delete(users.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { loginRequired } = require('../helpers');

const { users } = require('../handlers');

router
  .route('')
  .get(loginRequired, users.readUsers)
  .post(users.createUser);

router.post('/authenticate', users.authenticate);
router
  .route('/:username')
  .get(loginRequired, users.readUser)
  .patch(loginRequired, users.updateUser)
  .delete(loginRequired, users.deleteUser);

module.exports = router;

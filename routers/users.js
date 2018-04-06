const express = require('express');
const router = express.Router();
const { authRequired } = require('../helpers');
const { users } = require('../handlers');

router
  .route('')
  .get(authRequired, users.readUsers)
  .post(users.createUser);

router.post('/authenticate', users.authenticate);
router
  .route('/:username')
  .get(authRequired, users.readUser)
  .patch(authRequired, users.updateUser)
  .delete(authRequired, users.deleteUser);

module.exports = router;

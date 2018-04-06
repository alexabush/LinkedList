function loginRequired(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/users/login');
  } else {
    next();
  }
}

module.exports = loginRequired;

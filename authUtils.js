const jwt = require('jwt-simple');

function authUtils() {

  const TOKEN_SECRET = process.env.TOKEN_SECRET || 'verySecretSecret';

  /* eslint-disable no-unused-vars */
  function validateNewUser(userData, next) {
    // TODO finish all validation rules
    // name - not empty, minimum length

    // email - length and regex to validate email format, ensure email doesn't already exist
    if (!userData.email) { return next('Email is required'); }

    // password - business rules and restrictions (length, character whitelist, minimum strength)
    return next();
  }

  function checkAuth(req, res, next) {
    if (!req.header('authorization')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
      const token = req.header('authorization').split(' ')[1];
      const payload = jwt.decode(token, TOKEN_SECRET);

      if (!payload) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }

      req.userId = payload.sub;

      return next();
    } catch (ex) {
      return res.status(500).json({ message: ex.message });
    }
  }

  function generateToken(user) {
    const payload = { sub: user._id };
    return jwt.encode(payload, TOKEN_SECRET);
  }

  return {
    validateNewUser,
    checkAuth,
    generateToken
  };
}

module.exports = authUtils;
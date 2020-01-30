const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const TOKEN_SECRET = '123'; // TODO this should come from env or some config

function routes(User) {
  function checkAuth(req, res, next) {
    if (!req.header('authorization')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
      var token = req.header('authorization').split(' ')[1];
      var payload = jwt.decode(token, TOKEN_SECRET);

      if (!payload) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }

      req.userId = payload.sub;

      return next();
    }
    catch (ex) {
      console.error(ex);
      return res.status(500).json({ message: ex.message });
    }
  }

  function generateToken(user) {
    var payload = { sub: user._id };
    return jwt.encode(payload, TOKEN_SECRET);
  }

  function validateNewUser(userData) {
    // TODO validation
    // name - not empty, minimum length
    // email - length and regex to validate email format, ensure email doesn't already exist
    // password - business rules and restrictions (length, character whitelist, minimum strength)
    return true;
  }

  const router = express.Router();

  router.route('/register')
    .post((req, res) => {
      const user = new User(req.body);

      if (!validateNewUser(user)) {
        res.status(400).send({ message: "Invalid registration data" });
      }

      user.save((err, newUser) => {
        if (err) { return res.send(err); }

        return res.status(201).json({ token: generateToken(newUser) });
      });
    });

  router.route('/login')
    .post(async (req, res) => {
      var loginData = req.body;

      var user = await User.findOne({ email: loginData.email });

      if (!user) {
        return res.status(401).send({ message: 'Email invalid' });
      }

      bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Password invalid' });
        }

        return res.json({ token: generateToken(user) });
      });
    });

  router.route('/users')
    .patch(checkAuth, async (req, res) => {
      await User.findById(req.userId, (findError, user) => {
        if (findError) {
          res.send(400).json({ message: 'User not found' })
        }

        if (req.body._id) {
          delete req.body._id;
        }

        // Actually update model
        Object.entries(req.body).forEach((item) => {
          const key = item[0];
          const value = item[1];

          user[key] = value;
        });

        user.save((saveError) => {
          if (saveError) {
            return res.send(saveError);
          }
          return res.sendStatus(204);
        });
      });
    })
    .delete(checkAuth, async (req, res) => {

      await User.findById(req.userId, (findError, user) => {
        if (findError || !user) {
          return res.status(400).json({ message: 'User not found' })
        }

        user.remove((removeError) => {
          if (removeError) {
            return res.send(removeError);
          }

          return res.status(204).json({ message: 'User deleted successfully' });
        });
      });
    })
    // TODO debug -- check list of users
    .get(async (req, res) => {
      await User.find({}, '-password -__v', (err, user) => {
        if (err) { return res.send(err); }
        return res.json(user);
      });
    });

  return router;
}

module.exports = routes;
const express = require('express');
const jwt = require('jwt-simple');

function routes(User) {
  const router = express.Router();

  router.route('/register')
    .post((req, res) => {
      const user = new User(req.body);

      // TODO validation and hashing password
      // name - not empty, minimum length
      // email - regex to validate email format
      // password - business rules and restrictions (length, character whitelist, minimum strength)

      user.save((err, result) => {
        if (err) { return res.send(err); }

        res.status(201).json(user);
      });
    })

  router.route('/login')
    .post(async (req, res) => {
      var userData = req.body;

      var user = await User.findOne({ email: userData.email });

      if (!user || userData.password !== user.password) {
        return res.sendStatus(401).send({ message: 'Email or Password invalid' });
      }

      // generate token
      var payload = {};
      var token = jwt.encode(payload, 'mysecret');  // secret should come from config or something (env?)

      console.log(token);

      res.json({token});
    })

  // debug -- check list of users
  router.route('/users')
    .get(async (req, res) => {
      await User.find({}, '-password -__v', (err, user) => {
        if (err) { return res.send(err); }
        return res.json(user);
      });
    });

  // Middleware to find a user by id
  router.use('/users/:userId', (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) { return res.send(err); }
      if (user) {
        req.user = user;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  router.route('/users/:userId')
    .get((req, res) => res.json(req.user))
    .put((req, res) => {
      const { user } = req;

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      // TODO other fields and validation for updating

      req.user.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
    })
    .patch((req, res) => {
      const { user } = req;

      if (req.body._id) {
        delete req.body._id;
      }

      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        user[key] = value;
      });

      req.user.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
    })
    .delete((req, res) => {
      req.user.remove((err) => {
        if (err) {
          return res.send(err);
        }
        res.sendStatus(204);
      });
    });

  return router;
}

module.exports = routes;
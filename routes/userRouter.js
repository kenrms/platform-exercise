/* eslint-disable no-param-reassign */
const express = require('express');

function routes(User) {
  const userRouter = express.Router();

  userRouter.route('/users')
    .post((req, res) => {
      const user = new User(req.body);

      // TODO validation
      user.save();

      return res.status(201).json(user);
    })
    .get((req, res) => {
      User.find((err, books) => {
        if (err) { return res.send(err); }
        return res.json(books);
      });
    });

  userRouter.use('/users/:userId', (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) { return res.send(err); }
      if (user) {
        req.user = user;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  userRouter.route('/users/:userId')
    .get((req, res) => res.json(req.user))
    .put((req, res) => {
      const { user } = req;
      
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      // TODO other fields and validation for updating

      user.save();
      res.json(user);
    });

  return userRouter;
}

module.exports = routes;
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

  userRouter.route('/users/:userId')
    .get((req, res) => {
      User.findById(req.params.userId, (err, user) => {
        if (err) { return res.send(err); }
        return res.json(user);
      })
    })

  return userRouter;
}

module.exports = routes;
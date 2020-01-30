/* eslint-disable no-underscore-dangle */
const express = require('express');

const userController = require('../controllers/userController');
const { checkAuth } = require('../authUtils')();

function userRouter(User) {
  const controller = userController(User);
  const router = express.Router();

  router.route('/register').post(controller.register);
  router.route('/login').post(controller.login);
  router.route('/users')
    .patch(checkAuth, controller.update)
    .delete(checkAuth, controller.deleteUser)
    // TODO debug -- check list of users
    .get(async (req, res) => {
      await User.find({}, '-password -__v', (err, user) => {
        if (err) { return res.send(err); }
        return res.json(user);
      });
    });

  return router;
}

module.exports = userRouter;

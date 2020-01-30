const bcrypt = require('bcrypt-nodejs');
const { validateNewUser, generateToken } = require('../authUtils.js')();

function userController(User) {
  function register(req, res) {
    const user = new User(req.body);

    if (!validateNewUser(user)) {
      res.status(400).send({ message: 'Invalid registration data' });
    }

    user.save((err, newUser) => {
      if (err) { return res.send(err); }

      return res.status(201).json({ token: generateToken(newUser) });
    });
  }

  async function login(req, res) {
    const loginData = req.body;

    const user = await User.findOne({ email: loginData.email });

    if (!user) {
      return res.status(401).send({ message: 'Email invalid' });
    }

    return bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Password invalid' });
      }

      return res.json({ token: generateToken(user) });
    });
  }

  async function update(req, res) {
    await User.findById(req.userId, (findError, user) => {
      if (findError) {
        res.send(400).json({ message: 'User not found' });
      }

      if (req.body._id) {
        delete req.body._id;
      }

      // Actually update model
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];

        /* eslint-disable no-param-reassign */
        user[key] = value;
      });

      user.save((saveError) => {
        if (saveError) {
          return res.send(saveError);
        }
        return res.sendStatus(204);
      });
    });
  }

  async function deleteUser(req, res) {
    await User.findById(req.userId, (findError, user) => {
      if (findError || !user) {
        return res.status(400).json({ message: 'User not found' });
      }

      return user.remove((removeError) => {
        if (removeError) {
          return res.send(removeError);
        }

        return res.status(204).json({ message: 'User deleted successfully' });
      });
    });
  }

  return {
    register,
    login,
    update,
    deleteUser
  };
}

module.exports = userController;

const should = require('should');
const sinon = require('sinon');
const userController = require('../controllers/userController');

describe('User Controller Tests:', () => {
  describe('Register', () => {
    it('should not allow an empty email', () => {
      const User = function (user) { this.save = () => { } };
      const req = {
        body: {
          email: "",
          name: "John Doe",
          password: "myPw"
        }
      }

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      }

      const controller = userController(User);
      controller.register(req, res);

      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Email is required').should.equal(true);
    });
  });
});
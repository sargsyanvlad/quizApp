const userCtrl = require('../controllers/usersController');
module.exports = function (app) {

  // User Routes to signUp
  app.route('/signup')
    .post(userCtrl.signUp);

  // // User Routes to signIn
  app.route('/signin')
    .post(userCtrl.signIn);
};


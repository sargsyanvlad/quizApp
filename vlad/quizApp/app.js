const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const app = express();



const usersRouter = require('./api/routes/userRouter');
const authRouter = require('./api/routes/authRouter');
const quizRouter = require('./api/routes/quizRouter');

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://@localhost');
console.log('Connected to Mongodb');

//-- assign routes To app --//
authRouter(app);
usersRouter(app);
quizRouter(app);

//error hanelers
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    console.log('Error handler', err);
    res.status( err.statusCode || err.status || 500).send({error: err.message || err});
  }
});

app.listen(8080, () => console.log("App listening on port 8080!"));

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const apiRouter = require('./routes/api/index');

// CORS
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8080'
};
app.use(cors(corsOptions));

app.use('/api', apiRouter);

// connect MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/test?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connetion error'));
db.once('open', function() {
  console.log('mongoose connected');
  // const Restaurant = require('./models/restaurants');
  // Restaurant.findOne()
  //   .then(document => {
  //     if(document) return;
  //     const restaurant = new Restaurant({
  //       name: '장모님 식당',
  //       tags: ['한식'],
  //       address: '경기도 안양시 평촌동 123-1',
  //       phoneNumber: 1234567890
  //     });

  //     return restaurant.save();
  //   })
  //   .then(document => {
  //     console.log(document);
  //   })
  //   .catch(err => {
  //     throw err;
  //   });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

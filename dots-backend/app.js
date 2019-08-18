/**********************************************************
 * DoTS (Digitalization of Thinking Strategy)
 * KOREATECH CSE Graduation Portfolio Project
 *
 * Created by Haewoong Kwak, Myeonghwa Ji, Seongchan Kim
 **********************************************************/

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// var moviesRouter = require("./routes/movies");
var crawledDataRouter = require("./routes/user-crawled-data");
var apiRouter = require("./routes/api/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CORS option
var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
// app.use("/api/movies", moviesRouter);
app.use("/data", crawledDataRouter);

// connect MongoDB
var db_name = "test";
mongoose.connect(
  `mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/${db_name}?retryWrites=true&w=majority`,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connetion error"));
db.once("open", function() {
  console.log("mongoose connected");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

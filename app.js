const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const session = require("express-session");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const cors = require("cors");
const User = require("./models/user");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();
app.use(cors());
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log("finding");
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username" });
      bcrypt.compare(user.password, password, (err, res) => {
        if (res) return done(null, user);
        return done(null, false, { message: "Incorrect password" });
      });
      return done(err);
    });
  }),
);

passport.serializeUser((user, done) => {
  console.log("serialze");
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("de serialze");
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
passport.initialize();
passport.session();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use("/", indexRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

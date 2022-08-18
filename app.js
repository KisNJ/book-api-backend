const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const cors = require("cors");
const User = require("./models/user");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const signUpRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const app = express();

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
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://ancient-garden-81863.herokuapp.com", // <-- location of the react app were connecting to
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize());
app.use(passport.session());
// require("./passportConfig")(passport);

// catch 404 and forward to error handler
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ msg: "Failed to log out!" });
    } else {
      res.status(200).json({ msg: "Logged out succesfully!" });
    }
  });
});
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

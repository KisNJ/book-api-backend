const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
router.post("/", (req, res, next) => {
  console.log(req.body);
  if (!req.body || !req.body.password || !req.body.username) {
    res
      .status(400)
      .json({ msg: "Include a password and a username in your request!" });
  }
  // console.log(req.body);
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) next(err);
    try {
      console.log("try");
      await User.create({
        username: req.body.username,
        password: hashedPassword,
      });
      res.status(200).json({ msg: "Everything fine!" });
    } catch (error) {
      res
        .status(400)
        .json({ msg: "Duplicate username! Please choose a unique username!" });
    }
  });
  // res.sendStatus(200);
});
router.get("/check", (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ msg: "Not logged in!" });
  }
  // console.log(req.user);
});
module.exports = router;

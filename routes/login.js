const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("local", {
    // passReqToCallback: true,
    failureMessage: "bad password or username",
  }),
  (req, res) => {
    console.log("11");
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    }
  },
);

module.exports = router;

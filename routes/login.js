const express = require("express");
const router = express.Router();
const passport = require("passport");
const { response } = require("../app");

// router.post(
//   "/",
//   passport.authenticate("local", { passReqToCallback: true }),
//   (req, res) => {
//     console.log(req.isAuthenticated());
//     console.log("aaaaaaaaaaaaaa");
//     if (req.isAuthenticated()) {
//       res.json({ msg: "200" });
//     } else {
//       // res.sendStatus(401);
//     }
//   },
// );
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
      res.status(200).json({ msg: "okay" });
    }
    // If you use "Content-Type": "application/json"
    // req.isAuthenticated is true if authentication was success else it is false
    //   res.json({ auth: req.isAuthenticated() });
  },
);

module.exports = router;

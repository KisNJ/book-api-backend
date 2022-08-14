const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
router.post("/", (req, res, next) => {
  if (!req.body || !req.body.password || !req.body.username) {
    res.sendStatus(400);
  }
  console.log(req.body);
  //   bcrypt.hash(req.body.password);
  res.sendStatus(200);
});

module.exports = router;

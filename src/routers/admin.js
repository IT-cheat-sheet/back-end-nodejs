const express = require("express");
const router = new express.Router();
const Admins = require("../models/admins.js");
const tokenAdmins = require("../models/tokensAdmin");

router.get("/getAll", async (req, res) => {
  try {
    const admins = await Admins.findAll({});
    if (!admins || admins.length === 0) {
      res.send("No admin account found.");
      return;
    }
    res.send(admins);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;

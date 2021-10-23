const express = require("express");
const router = new express.Router();
const Admins = require("../models/admins.js");
const tokenAdmins = require("../models/tokensAdmin");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

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

router.post("/login", async (req, res) => {
  try {
    const findAdmin = await Admins.findOne({
      where: {
        userName: req.body.username,
        password: req.body.password,
      },
    });
    if (!findAdmin || findAdmin.length === 0) {
      throw new Error("Not found username or wrong password <3");
    }
    const token = jwt.sign(
      { adminId: findAdmin.adminId },
      process.env.JWT_SECRET
    );
    tokenAdmins.create({
      token,
      adminId: findAdmin.adminId,
    });
    res
      .status(200)
      .send({
        account: { adminId: findAdmin.adminId, userName: findAdmin.userName },
        token: token,
      });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/logout", auth, async (req, res) => {
  // ถ้าผ่านมาข้างล่าง แสดงว่า auth ผ่าน
  try {
    await tokenAdmins.destroy({
      where: {
        token: req.token,
      },
    });
    res.status(200).send("ลบแย้วน้า");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

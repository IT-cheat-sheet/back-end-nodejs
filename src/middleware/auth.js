const jwt = require("jsonwebtoken");
const Admin = require("../models/admins");
const tokensAdmin = require("../models/tokensAdmin");

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({
      where: {
        adminId: decoded.adminId,
      },
    });
    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

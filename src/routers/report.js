const express = require("express");
const router = new express.Router();
const { Op } = require("sequelize");
const Report = require("../models/reports");
const Review = require("../models/review");
const summaryPost = require("../models/summarypost");
const auth = require("../middleware/auth");

router.get("/getall", auth, async (req, res) => {
  try {
    req.query.readStatus = !req.query.readStatus ? 0 : req.query.readStatus;
    let reports = null;
    if (req.query.sortBy === "summaryPost") {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
          [Op.not]: [
            {
              summaryPostId: null,
            },
          ],
        },
        include: [
          {
            model: summaryPost,
            attributes: {
              exclude: ["blobFile"],
            },
          },
        ],
      });
    } else if (req.query.sortBy === "review") {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
          [Op.not]: [
            {
              reviewId: null,
            },
          ],
        },
        include: [
          {
            model: Review,
            attributes: {
              exclude: ["reviewImage"],
            },
          },
        ],
      });
    } else {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
        },
        include: [
          {
            model: Review,
            attributes: {
              exclude: ["reviewImage"],
            },
          },
          {
            model: summaryPost,
            attributes: {
              exclude: ["blobFile"],
            },
          },
        ],
      });
    }
    res.status(200).send({ reports });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = new express.Router();
const {
  Op
} = require("sequelize");
const Report = require("../models/reports");
const Review = require("../models/review");
const summaryPost = require("../models/summarypost");
const auth = require("../middleware/auth");

router.get("/getAll", auth,async (req, res) => {
  try {
    req.query.readStatus = !req.query.readStatus ? 0 : req.query.readStatus;
    req.query.search = !req.query.search ? "" : req.query.search;
    let reports = null;
    if (req.query.sortBy === "summaryPost") {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
          [Op.not]: [{
            summaryPostId: null,
          }, ],
        },
        include: [{
          model: summaryPost,
          as:'summarypost',
          attributes: {
            exclude: ["blobFile"],
          },
          where: {
            summaryTitle: {
              [Op.substring]: req.query.search
            }
          }
        }, ],
      });
    } else if (req.query.sortBy === "review") {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
          [Op.not]: [{
            reviewId: null,
          }, ],
        },
        include: [{
          model: Review,
          as:'reviews',
          attributes: {
            exclude: ["reviewImage"]
          },
          where: {
            reviewTitle: {
              [Op.substring]: req.query.search
            }
          }
        }, ],
      });
    } else {
      reports = await Report.findAll({
        where: {
          readStatus: req.query.readStatus,
          [Op.or]: [{
              '$summarypost.summaryTitle$': {
                [Op.substring]: req.query.search
              }
            },
            {
              '$reviews.reviewTitle$': {
                [Op.substring]: req.query.search
              }
            }
          ]
        },
        include: [{
            model: Review,
            as:'reviews',
            attributes: {
              exclude: ["reviewImage"],
            },
          },
          {
            model: summaryPost,
            as:'summarypost',
            attributes: {
              exclude: ["blobFile"],
            },
          },
        ],
      });
    }
    res.status(200).send({
      reports
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
});

router.post("/add", async (req, res) => {
  try {
    await Report.create(req.body);
    res.status(201).send({
      result: "Report has been created"
    });
  } catch (error) {
    res.status(500).send({
      error: error.message
    });
  }
});

router.put("/setReadStatus/:reportId", auth, async (req, res) => {
  try {
    const reportNumber = req.params.reportId;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["readStatus"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates!"
      });
    }
    let status = parseInt(req.body.readStatus);

    if (status > 1 || status < 0) {
      return res.status(400).send({
        error: "Status must be 0 or 1 only!"
      });
    }
    const reportFromId = await Report.update(req.body, {
      where: {
        reportNumber,
      },
    });
    if (reportFromId[0] === 0) {
      return res.status(400).send({
        error: "report not found or noting change in report!",
      });
    }
    res.status(201).send({
      status: "update successful !"
    });
  } catch (error) {
    res.status(400).send({
      error: error
    });
  }
});
module.exports = router;
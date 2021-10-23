const express = require("express");
const router = new express.Router();
const Topic = require("../models/topic");
const Review = require("../models/review");
const multer = require("multer");
const { Op, Sequelize } = require("sequelize");
const fs = require("fs");
const sequelize = require("../db/sequelize");
const auth = require("../middleware/auth");

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 24, //24MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG|PNG|pdf|PDF)$/)) {
      return cb(new Error());
    }
    cb(undefined, true);
  },
});

router.post("/add", async (req, res) => {
  try {
    await Review.create(req.body);
    res.send({ result: "Review has been created" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(
  "/file/upload/:reviewId",
  upload.single("image"),
  async (req, res) => {
    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    try {
      const blobFile =
        "data:" +
        req.file.mimetype +
        ";base64," +
        req.file.buffer.toString("base64");
      const uploadFile = await Review.update(
        { reviewImage: blobFile },
        {
          where: {
            reviewId: req.params.reviewId,
          },
        }
      );
      if (uploadFile[0] === 0) {
        return res.status(400).send("Upload file Failed.");
      }
      res.status(200).send({ status: "Upload image successful !" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/image/:reviewId", async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        reviewId: req.params.reviewId,
      },
    });
    console.log(review);
    if (!review) {
      return res.status(404).send({ error: "reviewId not found!" });
    }
    var rawfile = Buffer.from(review.reviewImage, "base64");
    const m = /^data:(.+?);base64,(.+)$/.exec(rawfile);
    if (!m) throw new Error();
    const [_, content_type, file_base64] = m;
    const file = Buffer.from(file_base64, "base64");
    res.set({
      "Content-Type": content_type,
      "Content-Length": file.length,
    });
    res.end(file);
  } catch (error) {
    res.status(404).send({ error: "File not found" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    //ค้นหาตามชื่อ topic
    req.query.sortTopic = !req.query.sortTopic ? "" : req.query.sortTopic;
    //เลขหน้า
    const offset = parseInt(req.query.page) * parseInt(req.query.pageSize);
    //ลิมิตของไอเทม
    const limit = parseInt(req.query.pageSize);
    //เรียงข้อมูล โดยดั้งเดิมเป็น topicName
    const sortBy = !req.query.sortReview ? "reviewId" : req.query.sortReview;
    //เรียงลำดับจากมากไปน้อย หรือ น้อยไปมาก
    const sortDesc = req.query.sortDesc == "true" ? "DESC" : "ASC";
    //ใช้เพื่อค้นหาคำใน Review (Title,Content,Reviewer)
    !req.query.searchWord ? "" : req.query.searchWord;
    //ตัวอย่าง
    //search=&page=0&pageSize=5&sortBy=reviewId&searchWord=search&sortDesc=false

    const searchReview = await Review.findAndCountAll({
      attributes: { exclude: ["reviewImage"] },
      include: {
        model: Topic,

        where: {
          topicName: {
            [Op.substring]: req.query.sortTopic,
          },
        },
      },
      where: {
        [Op.or]: [
          {
            reviewTitle: {
              [Op.substring]: req.query.searchWord,
            },
          },
          {
            reviewContent: {
              [Op.substring]: req.query.searchWord,
            },
          },
          {
            reviewer: {
              [Op.substring]: req.query.searchWord,
            },
          },
        ],
      },
      order: [[sortBy, sortDesc]],
      limit,
      offset,
    });
    totalPage = Math.ceil(searchReview.count / limit);
    res.status(200).send({ data: searchReview, totalPage });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const review = await Review.findOne({
      attributes: { exclude: ["reviewImage", "topicId"] },
      where: {
        reviewID: id,
      },
      include: {
        model: Topic,
      },
    });
    if (!review) {
      res.send("Item not found!");
    }
    res.status(200).send({ data: review });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/edit/:id", auth, async (req, res) => {
  const checkKeyBody = Object.keys(req.body);
  const allowedKey = [
    "reviewTitle",
    "reviewContent",
    "reviewLink",
    "reviewer",
    "topicId",
  ];
  const validKey = checkKeyBody.every((checkKeyBody) => {
    return allowedKey.includes(checkKeyBody);
  });
  if (!validKey) {
    return res.status(400).send({ message: "Invalid key!" });
  }
  const id = req.params.id;
  try {
    await Review.update(req.body, {
      where: {
        reviewID: id,
      },
    });
    res.status(201).send({ message: "Edit success!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const reviewDelete = await Review.destroy({
      where: {
        reviewID: id,
      },
    });
    res.send({ message: "Item has been deleted" });
    if (!reviewDelete) {
      res.status(400).send({ message: "Item can't delete with that Id!" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/hotReview/:topicId", async (req, res) => {
  try {
    console.log(req.params.topicId);
    const hotReview = await Review.findAll({
      attributes: { exclude: ["reviewImage"] },
      include: {
        model: Topic,
        where: {
          topicId: req.params.topicId,
        },
      },
      order: Sequelize.literal("rand()"),
      limit: 1,
    });
    console.log(hotReview);
    if (hotReview.length === 0) throw Error("Not found review");
    res.status(200).send({ data: hotReview });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/random", async (req, res) => {
  try {
    const randomReview = await Review.findAll({
      attributes: { exclude: ["reviewImage"] },
      order: Sequelize.literal("rand()"),
      limit: 4,
    });
    res.status(200).send({ data: randomReview });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = router;

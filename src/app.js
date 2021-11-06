const express = require("express");
const cors = require("cors"); 
const subjectRouter = require("./routers/subject");
const semesterRouter = require("./routers/semester");
const summarypostRouter = require("./routers/summarypost");
const topicRouter = require("./routers/topic");
const reviewRouter = require("./routers/review");
const adminRouter = require("./routers/admin");
const reportRouter = require('./routers/report')
const app = express();

const port = process.env.PORT;

app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTION']
}))

app.use(express.json());
app.use("/subject", subjectRouter);
app.use("/semester", semesterRouter);
app.use("/summarypost", summarypostRouter);
app.use("/report",reportRouter)

//Tien
app.use("/topic", topicRouter);
app.use("/review", reviewRouter);

// JJ
app.use("/admin", adminRouter);

app.get("/health", (req, res) => {
  res.send({ status: "This service is healthy." });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

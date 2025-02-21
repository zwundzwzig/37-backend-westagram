//routes/index.js
const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const likeRouter = require("./likeRouter");

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/likes", likeRouter);

module.exports = router;

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

// Thêm bình luận mới vào photo
router.post("/:photo_id", commentController.addCommentToPhoto);

module.exports = router;
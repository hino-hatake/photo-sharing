const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photo");

// Thêm bình luận mới vào photo
router.post("/:photo_id", photoController.addCommentToPhoto);

module.exports = router;
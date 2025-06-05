const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photo");
const upload = require("../middleware/multerUpload");

// Lấy tất cả ảnh của user
router.get("/:user_id", photoController.getPhotosOfUser);

// Upload ảnh mới
router.post("/new", upload.single("photo"), photoController.uploadPhoto);

module.exports = router;
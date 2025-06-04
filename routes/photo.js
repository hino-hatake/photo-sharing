const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photo");

router.get("/:id", photoController.getPhotosOfUser);

module.exports = router;
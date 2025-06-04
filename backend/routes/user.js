const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/list", userController.getUserList);
router.get("/:id", userController.getUserDetail);

module.exports = router;
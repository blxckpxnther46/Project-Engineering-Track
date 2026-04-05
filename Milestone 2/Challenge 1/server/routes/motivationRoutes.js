const express = require("express");
const router = express.Router();
const motivationController = require("../controllers/motivationController");

router.get("/", motivationController.getTaskProgress);

module.exports = router;

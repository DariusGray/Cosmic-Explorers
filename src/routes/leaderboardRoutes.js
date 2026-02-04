const express = require("express");
const router = express.Router();
const controller = require("../controllers/leaderboardController");

router.get("/", controller.getTopUsers);

module.exports = router;

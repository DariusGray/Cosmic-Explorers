const express = require("express");
const router = express.Router();
const controller = require("../controllers/leaderboardController");

router.get("/", controller.getTopUsers);
router.get("/:limit", controller.getTopUsersWithLimit);

module.exports = router;

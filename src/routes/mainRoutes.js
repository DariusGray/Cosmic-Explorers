//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require("express");
const router = express.Router();

//////////////////////////////////////////////////////
// ROUTE FILES
//////////////////////////////////////////////////////
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const challengeRoutes = require("./challengeRoutes");
const userPlanetRoutes = require("./userPlanetRoutes");
const planetRoutes = require("./planetRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");

//////////////////////////////////////////////////////
// MOUNT ROUTES
//////////////////////////////////////////////////////
router.use("/auth", authRoutes);

router.use("/users", userRoutes);
router.use("/users", userPlanetRoutes);

router.use("/challenges", challengeRoutes);
router.use("/planets", planetRoutes);
router.use("/leaderboard", leaderboardRoutes);

//////////////////////////////////////////////////////
// EXPORT ROUTER
//////////////////////////////////////////////////////
module.exports = router;

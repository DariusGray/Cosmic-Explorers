const express = require("express");
const router = express.Router();

const controller = require("../controllers/planetController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:user_id/planets", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserParam,
  controller.checkUserExists,
  controller.getPlanetsByUser,
]);

router.post("/:user_id/planets/unlock", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserParam,
  controller.checkUserExists,
  controller.unlockPlanets,
  controller.updateLatestDiscoveredPlanet,
  controller.respondUnlockedPlanets,
]);

module.exports = router;

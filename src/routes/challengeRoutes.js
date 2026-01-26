const express = require("express");
const router = express.Router();

const controller = require("../controllers/challengeController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

//////////////////////////////////////////////////////
// POST /challenges (protected)
//////////////////////////////////////////////////////
router.post("/", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserBody, // body.user_id must match token userId
  controller.createNewChallenge,
  controller.readChallengeByIdAfterCreate,
]);

//////////////////////////////////////////////////////
// GET /challenges (public)
//////////////////////////////////////////////////////
router.get("/", controller.readAllChallenges);

//////////////////////////////////////////////////////
// PUT /challenges/:challenge_id (protected)
//////////////////////////////////////////////////////
router.put("/:challenge_id", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserBody,
  controller.checkChallengeExistsAndOwner,
  controller.updateChallengeById,
]);

//////////////////////////////////////////////////////
// DELETE /challenges/:challenge_id (protected)
//////////////////////////////////////////////////////
router.delete(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserBody,
  controller.checkChallengeExistsAndOwnerForDelete,
  controller.deleteChallengeCompletions,
  controller.deleteChallengeById
);

//////////////////////////////////////////////////////
// POST /challenges/:challenge_id completion (protected)
//////////////////////////////////////////////////////
router.post("/:challenge_id", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserBody,
  controller.validateCompletionBody,
  controller.checkChallengeExists,
  controller.checkUserExists,
  controller.createCompletion,
  controller.rewardPointsToUser,
  controller.respondCreatedCompletion,
]);

//////////////////////////////////////////////////////
// GET /challenges/:challenge_id (public)
//////////////////////////////////////////////////////
router.get("/:challenge_id", controller.readUsersByChallengeId);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

const jwtMiddleware = require("../middlewares/jwtMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", controller.readAllUser);
router.get("/:user_id", controller.readUserById);

// completed missions log (protected)
router.get("/:user_id/completions", [
  jwtMiddleware.verifyToken,
  authMiddleware.requireSameUserParam,
  controller.readUserCompletionsByUserId,
]);

router.put("/:user_id", [
  controller.readUserByUsername,
  controller.updateUserById,
  controller.readUserById,
]);

module.exports = router;

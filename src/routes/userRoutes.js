const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.readAllUser);
router.get("/:user_id", controller.readUserById);

router.put("/:user_id", [
  controller.readUserByUsername,
  controller.updateUserById,
  controller.readUserById,
]);

module.exports = router;

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

//////////////////////////////////////////////////////
// POST /auth/register
//////////////////////////////////////////////////////
router.post("/register", [
  authController.validateRegisterBody,
  authController.checkRegisterConflict,
  bcryptMiddleware.hashPassword,
  authController.registerUser,
  jwtMiddleware.generateToken,
  // Return token so frontend can auto-login after register
  authController.beforeSendLoginToken,
  authController.sendLoginResponse,
]);

//////////////////////////////////////////////////////
// POST /auth/login
//////////////////////////////////////////////////////
router.post("/login", [
  authController.validateLoginBody,
  authController.loadUserByEmail,
  bcryptMiddleware.comparePassword,
  authController.beforeSendLoginToken,
  jwtMiddleware.generateToken,
  authController.sendLoginResponse,
]);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/planetController");

router.get("/", controller.getAllPlanets);

module.exports = router;

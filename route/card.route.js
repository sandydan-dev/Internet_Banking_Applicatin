const express = require("express");
const router = express.Router();

// middleware
const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

const { activateCardNumber } = require("../controller/card.controller");

//todo: routes

// activated car number route
// 78640721583
router.post(
  "/activate_card/:accountNumber",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  activateCardNumber
);

// exports router
module.exports = router;

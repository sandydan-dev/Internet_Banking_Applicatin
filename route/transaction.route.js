const express = require("express");
const router = express.Router();

// middleware
const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

// transaction controller
const {
  depositeMoneyToAccountNumber,
  transferMoneyBetweenAccounts,
} = require("../controller/transaction.controller");

// routes

//todo: only deposite receiver money
// endpoint : http://localhost:4002/api/v1/transaction/deposit ✅
router.post(
  "/deposit",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  depositeMoneyToAccountNumber
);

// todo: transfer between account numbers
// endpoint : http://localhost:4002/api/v1/transaction/tranfer_money
router.post(
  "/tranfer_money",
  verifyToken,
  authorizeRole(["cutomer","employee", "admin"]),
  transferMoneyBetweenAccounts
);

module.exports = router;

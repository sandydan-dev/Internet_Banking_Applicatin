const express = require("express");
const router = express.Router();
// const AccountOpenForm = require("../model/AccountOpenForm.model");
// const BankBranch = require("../model/BankBranch.model");

const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

// bank account controller
const {
  createBankCustomerAccount,
} = require("../controller/BankAccount.controller");

// bank account routes
router.post(
  "/create_bank_account",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  createBankCustomerAccount
);


module.exports = router;
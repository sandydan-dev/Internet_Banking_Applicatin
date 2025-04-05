const express = require("express");
const router = express.Router();
// const AccountOpenForm = require("../model/AccountOpenForm.model");
// const BankBranch = require("../model/BankBranch.model");

const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

// bank account controller
const {
  createBankCustomerAccount,
  getAllActiveBankAccounts,
  getAllPendingBankAccounts,
  getAllPendingAccountForms,
  freezeBankAccount,
  defreezeBankAccount,
  getAllFreezeBankAccounts,
} = require("../controller/bankAccount.controller");

//todo: bank account routes
// endpoint : http://localhost:4002/api/v1/bank_account/create_bank_account
router.post(
  "/create_bank_account",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  createBankCustomerAccount
);

//todo: get all active bank accounts
// endpoint : http://localhost:4002/api/v1/bank_account/get_all_active_accounts
router.get(
  "/get_all_active_accounts",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  getAllActiveBankAccounts
);

//todo: get all pending bank accounts
// endpoint : http://localhost:4002/api/v1/bank_account/get_all_pending_accounts
router.get(
  "/get_all_pending_accounts",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  getAllPendingBankAccounts
);

// todo: get all pending account open forms
// endpoint : http://localhost:4002/api/v1/bank_account/get_all_pending_forms
router.get(
  "/get_all_pending_forms",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  getAllPendingAccountForms
);

//todo: freeze bank account , account will be only read-only
// endpoint : http://localhost:4002/api/v1/bank_account/freeze_account/:id
// http://localhost:4002/api/v1/bank_account/freeze_account/78640721583
router.patch(
  "/freeze_account/:id",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  freezeBankAccount
);

// defreeze the account remove from freezing
// endpoint : http://localhost:4002/api/v1/bank_account/freeze_account/:id
// http://localhost:4002/api/v1/bank_account/defreeze_account/78640721583
router.patch(
  "/defreeze_account/:id",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  defreezeBankAccount
);

//todo: get all freeze bank accounts
// endpoint : http://localhost:4002/api/v1/bank_account/get_all_freeze_accounts
router.get(
  "/get_all_freeze_accounts",
  verifyToken,
  authorizeRole(["admin", "employee"]),
  getAllFreezeBankAccounts
);

module.exports = router;

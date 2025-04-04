const express = require("express");
const router = express.Router();

const {
  accountCreationForm,
  getPendingAccountForms,
} = require("../controller/accountOpen.controller");
const authorizeRole = require("../middleware/checkRole");
const verifyToken = require("../middleware/jwt.middleware");

const AccountOpenForm = require("../model/AccountOpenForm.model");

// account open route
router.post("/account_open_form", accountCreationForm);

router.get(
  "/pending_forms",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  getPendingAccountForms
);

module.exports = router;

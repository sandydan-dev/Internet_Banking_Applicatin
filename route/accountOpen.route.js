const express = require("express");
const router = express.Router();

// middleware
const authorizeRole = require("../middleware/checkRole");
const verifyToken = require("../middleware/jwt.middleware");

// controllers
const {
  accountCreationForm,
  getPendingAccountForms,
  deleteAccountOpenForm,
} = require("../controller/accountOpen.controller");

// account open route
// enpoint : http://localhost:4002/api/v1/account_form/account_open_form
router.post("/account_open_form", accountCreationForm);

// get all pending account open forms
// endpoint : http://localhost:4002/api/v1/account_form/pending_forms
router.get(
  "/pending_forms",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  getPendingAccountForms
);

// delete account open form by ID
// endpoint : http://localhost:4002/api/v1/account_form/delete_form/:id
router.delete(
  "/delete_form/:id",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  deleteAccountOpenForm
);

module.exports = router;

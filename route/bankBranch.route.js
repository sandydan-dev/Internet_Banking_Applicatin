const express = require("express");
const router = express.Router();

// controllers
const {
  createBankBranchData,
  getAllBankBranchDetails,
} = require("../controller/bankBranch.controller");

// http://localhost:4002/api/v1/branch/create_branch_data
router.post("/create_branch_data", createBankBranchData);

// get all bank list
router.get("/bank_list", getAllBankBranchDetails);

module.exports = router;

const express = require("express");
const router = express.Router();

//todo: controllers
const {
  createBankBranchData,
  getAllBankBranchDetails,
  updateBankBranchData,
  deleteBankBranchData,
  searchBankBranchData
} = require("../controller/bankBranch.controller");

//todo: create bank branch data
//? http://localhost:4002/api/v1/branch/create_branch_data
router.post("/create_branch_data", createBankBranchData);

//todo: get all bank list
//? http://localhost:4002/api/v1/branch/bank_list
router.get("/bank_list", getAllBankBranchDetails);


//todo: update bank branch data
//? http://localhost:4002/api/v1/branch/update_branch_data/:id
router.put("/update_branch_data/:id", updateBankBranchData);

//todo: delete bank branch data
//? http://localhost:4002/api/v1/branch/delete_branch_data/:id
router.delete("/delete_branch_data/:id", deleteBankBranchData);

//todo: search bank branch data
//? http://localhost:4002/api/v1/branch/search_branch_data?branchName=xyz
router.get("/search_branch_data", searchBankBranchData);

module.exports = router;

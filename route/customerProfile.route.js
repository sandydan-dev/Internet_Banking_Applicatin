const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

// controllers
const {
  createCustomerProfileData,
  getAllCustomerProfileData,
} = require("../controller/customerProfile.controller");

router.post("/create_profile", verifyToken, createCustomerProfileData);

// get all customer profile data
router.get(
  "/get_all_profile",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  getAllCustomerProfileData
);

module.exports = router;

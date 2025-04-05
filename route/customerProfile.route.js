const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

// controllers
const {
  createCustomerProfileData,
  getAllCustomerProfileData,
  updateCustomerProfileData,
  deleteCustomerProfileData
} = require("../controller/customerProfile.controller");

//todo : customer profile routes
// endpoint : http://localhost:4002/api/v1/customer_profile/create_profile
router.post("/create_profile", verifyToken, createCustomerProfileData);

//todo : update customer profile data
// endpoint : http://localhost:4002/api/v1/customer_profile/update_profile/:id
router.put(
  "/update_profile/:id",
  verifyToken,
  authorizeRole(["customer"]),
  updateCustomerProfileData
);

//todo:  get all customer profile data
// only admin and employee can access this route
// endpoint : http://localhost:4002/api/v1/customer_profile/get_all_profile
router.get(
  "/get_all_profile",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  getAllCustomerProfileData
);


// todo: delete customer profile data
// only admin and employee can access this route
// endpoint : http://localhost:4002/api/v1/customer_profile/delete_profile/:id
router.delete(
  "/delete_profile/:id",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  deleteCustomerProfileData
);


module.exports = router;

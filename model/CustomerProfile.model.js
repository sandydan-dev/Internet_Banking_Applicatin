const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Linked to User Auth Service
    fullName: { type: String, required: true },
    email: { type: String, required: true }, // Fetched from User Auth Service
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true, default: "customer" }, // Fetched (e.g., 'customer', 'employee', admin.)
    profileStatus: {
      type: String,
      enum: ["active", "inactive", "rejected", "pending"],
      default: "pending",
    },
    remarks: {
      type: String,
      default: "No remarks provided",
    }
  },
  {
    timestamps: true,
  }
);

const CustomerProfile = mongoose.model(
  "CustomerProfile",
  customerProfileSchema
);

module.exports = CustomerProfile;

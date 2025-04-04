const mongoose = require("mongoose");

const BankAccountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `ACC${Date.now()}${Math.floor(
        10000 + Math.random() * 99999
      ).toString()}`;
    },
  },
  customerId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `CUST${Date.now()}${Math.floor(
        100000 + Math.random() * 90000
      ).toString()}`;
    },
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `786${Date.now()}${Math.floor(
        10000000 + Math.random() * 90000000
      ).toString()}`;
    },
  },
  accountType: {
    type: String,
    required: true,
    enum: ["saving", "current", "loan"],
    default: "saving",
  },
  balance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "closed", "pending"],
    default: "pending",
  },
  employeeId: { type: String, required: true },
});

const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

module.exports = BankAccount;

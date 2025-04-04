const mongoose = require("mongoose");

const BankAccountSchema = new mongoose.Schema(
  {
    //todo: auto generated accountId
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
    //todo: auto generated customerId
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
    //todo: auto generated branchId
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
    // todo: get accountHolderId from AccountOpenForm
    acoountHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountOpenForm",
      required: true,
    },
    openingDate: { type: Date, default: Date.now },
    closingDate: { type: Date, default: null },
    accountType: {
      type: String,
      required: true,
      enum: ["saving", "current", "loan"],
      default: "saving",
    },
    currency: {
      type: String,
      required: true,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
    },
    balance: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "closed", "pending"],
      default: "pending",
    },
    employeeId: { type: String, required: true },
  },
  { timestamps: true }
);

const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

module.exports = BankAccount;

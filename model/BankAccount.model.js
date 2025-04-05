const mongoose = require("mongoose");

const BankAccountSchema = new mongoose.Schema(
  {
    //todo: auto generated accountId
    accountId: {
      type: String,
      // required: true,
      unique: true,
      default: function () {
        return `ACC${Math.floor(10001 + Math.random() * 99999).toString()}`;
      },
    },
    //todo: auto generated customerId
    customerId: {
      type: String,
      // required: true,
      unique: true,
      default: function () {
        return `CUST${Math.floor(
          1000001 + Math.random() * 9999999
        ).toString()}`;
      },
    },
    //todo: auto generated branchId
    accountNumber: {
      type: String,
      // required: true,
      unique: true,
      default: function () {
        return `786${Math.floor(
          10000001 + Math.random() * 99999999
        ).toString()}`;
      },
    },
    // todo: get accountHolderId from AccountOpenForm
    accountHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountOpenForm",
      // required: true,
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
      enum: [
        "active",
        "inactive",
        "closed",
        "pending",
        "suspended",
        "blocked",
        "deleted",
        "fraud",
        "freeze",
      ],
      default: "pending",
    },
    employeeId: { type: String, required: true }, //todo: Employee ID of the bank employee who opened the account
  },
  { timestamps: true }
);

const BankAccount = mongoose.model("BankAccount", BankAccountSchema);

module.exports = BankAccount;

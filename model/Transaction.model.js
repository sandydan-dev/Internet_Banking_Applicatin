const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      default: function () {
        return `TXN${Date.now()}${Math.floor(10000 + Math.random() * 90000)}`;
      },
    },
    senderAccountNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount", // Reference to the sender's account
    },
    receiverAccountNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount", // Reference to the receiver's account
    },

    // name of the account holder
    accoountHolderName: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: [1, "Transaction amount must be greater than zero"],
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["deposit", "withdraw", "transfer"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    remarks: {
      type: String,
      maxlength: 255,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;

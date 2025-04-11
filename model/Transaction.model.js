const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    // auto generated transaction id
    transactionId: {
      type: String,
      unique: true,
      default: function () {
        return `TXN${Date.now()}${Math.floor(10000 + Math.random() * 90000)}`;
      },
    },
    // Sender's account number
    senderAccountNumber: {
      type: String, 
    },
    // Receiver's account number
    receiverAccountNumber: {
      type: String, 
    },
    // account holder name
    accoountHolderName: {
      type: String,
    },
    // amount to be added
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
    // auto generated date 
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;

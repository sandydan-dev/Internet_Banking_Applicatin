const mongoose = require("mongoose");

const TransactionHistorySchema = new mongoose.Schema(
  {
    historyTransactionId: {
      type: String,
      unique: true,
      default: function () {
        return `HTXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
      },
    },

    cardNumber: {
      type: String,
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "deposit",
        "account_to_account",
        "card_to_card",
        "card_to_account",
        "account_to_card",
      ],
    },
    senderAccountNumber: {
      type: String,
    },
    receiverAccountNumber: {
      type: String,
    },
    senderCardNumber: {
      type: String,
    },
    receiverCardNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Transaction amount must be greater than zero"],
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
    date: {
      type: Date,
      default: Date.now,
    },
    depositedBy: {
      type: String, // Name of the person who deposited the money
      default: null,
    },
  },
  { timestamps: true }
);

const TransactionHistory = mongoose.model(
  "TransactionHistory",
  TransactionHistorySchema
);

module.exports = TransactionHistory;

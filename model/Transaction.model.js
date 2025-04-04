const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    default: function () {
      return `TXN${Date.now()}${Math.floor(10000 + Math.random() * 90000)}`;
    },
  },
  senderAccountId: {
    type: String,
    required: true,
    validate: {
      validator: async function (value) {
        // Verify if sender account exists
        const accountExists = await mongoose.model('BankAccount').findOne({ accountId: value });
        return accountExists !== null;
      },
      message: 'Invalid sender account ID',
    },
  },
  receiverAccountId: {
    type: String,
    required: true,
    validate: {
      validator: async function (value) {
        // Verify if receiver account exists
        const accountExists = await mongoose.model('BankAccount').findOne({ accountId: value });
        return accountExists !== null;
      },
      message: 'Invalid receiver account ID',
    },
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Transfer amount must be greater than zero'],
  },
  currency: {
    type: String,
    required: true,
    enum: ["INR", "USD", "EUR", "GBP"], // Same as your account model
    default: "INR",
  },
  transactionType: {
    type: String,
    required: true,
    enum: ["credit", "debit"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  remarks: {
    type: String,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

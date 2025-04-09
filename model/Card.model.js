const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    // auto generated id
    cardId: {
      type: String,
      unique: true,
      default: function () {
        return `CARD${Math.floor(1000 + Math.random() * 9000)}`;
      },
    },
    // take ref from bankAccount model object id
    customerId: {
      type: String, // Change from ObjectId to String
      required: true,
    },
    // store cardholder's name for verification
    cardHolderName: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      required: true,
      enum: ["debit", "credit"],
    },
    // auto generate card number by default
    cardNumber: {
      type: String,
      unique: true,
      default: function () {
        return `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
      },
    },
    // expiry set to from today then expire on after 5 year later
    expiryDate: {
      type: Date,
      required: true,
      default: function () {
        const now = new Date();
        return new Date(now.setFullYear(now.getFullYear() + 5)); // 5 years validity
      },
    },
    // auto generate cvv for card
    cvv: {
      type: String,
      required: true,
      default: function () {
        return Math.floor(100 + Math.random() * 900).toString(); // 3-digit CVV
      },
    },
    status: {
      type: String,
      enum: ["active", "blocked", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", CardSchema);

module.exports = Card;

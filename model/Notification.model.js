const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    unique: true,
    default: function () {
      return `NOTIF${Date.now()}${Math.floor(10000 + Math.random() * 90000)}`;
    },
  },
  // Link to the customer
  customerId: {
    type: mongoose.Schema.Types.String,
    ref: "BankAccount", // Reference to the BankAccount model
    required: true,
  }, 
  type: { type: String, enum: ["email", "SMS", "in-app"], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


const Notification = mongoose.model('Notification', NotificationSchema);

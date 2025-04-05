const mongoose = require("mongoose");

const accountOpeningFormSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `FORM${Date.now()}${Math.floor(
        1001 + Math.random() * 9999
      ).toString()}`;
    },
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankBranch",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    default: "No email provided",
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },

  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },

  accountType: {
    type: String,
    required: true,
    enum: ["Saving", "Current", "Fixed Deposit", "Loan"],
    default: "Saving",
  },
  initialDeposit: {
    type: Number,
    required: true,
    default: 0,
  },
  identityProof: {
    type: String,
    default: "No identity provided",
  },
  addressProof: {
    type: String,
    default: "No address proof provided",
  },
  occupation: {
    type: String,
  },
  incomeRange: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  remarks: {
    type: String,
    default: "No remarks provided",
  },
}, {
  timestamps: true,
});

const AccountOpenForm = mongoose.model(
  "AccountOpenForm",
  accountOpeningFormSchema
);

module.exports = AccountOpenForm;

// {
//     "formId": "FORM-16807999999123",
//     "fullName": "Sandeep Patil",
//     "dateOfBirth": "1990-04-06",
//     "phoneNumber": "9876543210",
//     "email": "sandeep.patil@example.com",
//     "gender": "Male",
//     "address": {
//       "street": "Shivaji Road",
//       "city": "Junnar",
//       "state": "Maharashtra",
//       "zipCode": "410502"
//     },
//     "branchId": "BR001",
//     "branchName": "Junnar Branch",
//     "ifscCode": "BANK0123456",
//     "accountType": "Savings",
//     "initialDeposit": 5000,
//     "identityProof": "Aadhaar Card",
//     "addressProof": "Electricity Bill",
//     "occupation": "Software Developer",
//     "incomeBracket": "5L-10L",
//     "submittedAt": "2025-04-06",
//     "status": "pending",
//     "remarks": ""
//   }

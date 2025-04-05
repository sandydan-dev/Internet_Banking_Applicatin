const mongoose = require("mongoose");

const BankBranchSchema = new mongoose.Schema(
  {
    // todo: auto generated branchId
    //todo: Unique identifier for the branch, auto-generated
    branchId: {
      type: String,
      unique: true,
      default: function () {
        return `B-${Math.floor(1001 + Math.random() * 9999).toString()}`;
      },
    },

    branchName: {
      type: String,
      required: true,
    },
    //todo: ifscCode auto generated based on branch name and city
    ifscCode: {
      type: String,
      unique: true,
      default: function () {
        const cityCode = this.city
          ? this.city.substring(0, 3).toUpperCase()
          : "IPOS";
        return `IFSC${cityCode}${Math.floor(
          1000001 + Math.random() * 3000000
        ).toString()}`;
      },
    },
    address: { type: String, required: true }, // Full address of the branch
    city: { type: String, required: true }, // City of the branch
    state: { type: String, required: true }, // State of the branch
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Primary branch contact number
    email: { type: String }, // Branch email address
    start: { type: String, required: true, default: "9:00 AM" }, // Branch opening time
    end: { type: String, required: true, default: "5:00 PM" }, // Branch closing time
    daysOpen: {
      type: [String],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    }, // Days of the week when the branch is open

    branchManager: {
      type: String,
      required: true, // Name of the branch manager
    },
    atmAvailability: {
      type: Number,
      default: 1, // Number of ATMs located at the branch
    },
  },
  {
    timestamps: true,
  }
);

const BankBranch = mongoose.model("BankBranch", BankBranchSchema);

module.exports = BankBranch;

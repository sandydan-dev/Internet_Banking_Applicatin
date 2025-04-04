const BankBranch = require("../model/BankBranch.model");

// create  bank branch
const createBankBranchData = async (req, res) => {
  try {
    const {
      branchName,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
      email,
      branchManager,
      atmAvailability,
    } = req.body;

    const newBranchData = new BankBranch({
      branchName,
      address,
      city,
      state,
      zipCode,
      phoneNumber,
      email,
      branchManager,
      atmAvailability,
    });

    const saveData = await newBranchData.save();

    return res
      .status(201)
      .json({ message: "Branch data created successfully", saveData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while creating Bank Branch data", error });
  }
};

// get all branch bank

const getAllBankBranchDetails = async (req, res) => {
  try {
    const bank = await BankBranch.find();

    if (bank.length === 0) {
      return res.status(404).json({ message: "Bank list not found" });
    }

    return res.status(200).json({ message: "All Bank Branch List", bank });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting bank list", error });
  }
};

module.exports = {
  createBankBranchData,
  getAllBankBranchDetails
};

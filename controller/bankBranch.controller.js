const BankBranch = require("../model/BankBranch.model");

//todo: create  bank branch
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

//todo: get all branch bank details
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

// todo: update bank branch data
const updateBankBranchData = async (req, res) => {
  try {
    const id = req.params.id;
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

    // Validate the request body
    if (
      !branchName ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the branch exists
    const branchExists = await BankBranch.findById(id);
    if (!branchExists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update the branch data
    const updateBranch = await BankBranch.findByIdAndUpdate(
      { _id: id },
      {
        branchName,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
        email,
        branchManager,
        atmAvailability,
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      message: "Branch data updated successfully",
      updateBranch,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating branch data",
      error: error.message,
    });
  }
};


// todo: delete bank branch data
const deleteBankBranchData = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the branch exists
    const branchExists = await BankBranch.findById(id);
    if (!branchExists) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Delete the branch data
    await BankBranch.findByIdAndDelete(id);

    return res.status(200).json({ message: "Branch data deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting branch data",
      error: error.message,
    });
  }
};


// todo: search bank branch data by name, city, state, ifscCode,
const searchBankBranchData = async (req, res) => {
  try {
    const { branchName, city, state, ifscCode } = req.query;

    // Build the search criteria
    const searchCriteria = {};
    if (branchName) {
      searchCriteria.branchName = { $regex: branchName, $options: "i" };
    }
    if (city) {
      searchCriteria.city = { $regex: city, $options: "i" };
    }
    if (state) {
      searchCriteria.state = { $regex: state, $options: "i" };
    }
    if (ifscCode) {
      searchCriteria.ifscCode = { $regex: ifscCode, $options: "i" };
    }

    const branches = await BankBranch.find(searchCriteria);

    if (branches.length === 0) {
      return res.status(404).json({ message: "No branches found" });
    }

    return res.status(200).json({ message: "Search results", branches });
  } catch (error) {
    return res.status(500).json({
      message: "Error while searching branch data",
      error: error.message,
    });
    
  }
}


module.exports = {
  createBankBranchData,
  getAllBankBranchDetails,
  updateBankBranchData,
  deleteBankBranchData,
  searchBankBranchData,
};

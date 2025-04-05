const AccountOpenForm = require("../model/AccountOpenForm.model");
const BankBranch = require("../model/BankBranch.model");

// Function to handle account creation form submission
// This function handles the creation of a new account open form
// It validates the input data, checks for existing users, and saves the new form to the database
// It also populates the branchId field with the corresponding branch details
const accountCreationForm = async (req, res) => {
  try {
    const {
      branchId,
      fullName,
      dateOfBirth,
      phoneNumber,
      email,
      gender,
      street,
      city,
      state,
      zipcode,
      identityProof,
      addressProof,
      occupation,
      incomeRange,
    } = req.body;

    // Validate required fields
    if (
      !branchId ||
      !fullName ||
      !dateOfBirth ||
      !phoneNumber ||
      !email ||
      !gender ||
      !street ||
      !city ||
      !state ||
      !zipcode
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // find the branch by ID

    const findBancBranchId = await BankBranch.findById(branchId);
    if (!findBancBranchId) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // check if user already exists for the same branch
    const existingUser = await AccountOpenForm.findOne({
      branchId: findBancBranchId._id,
      phoneNumber,
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists for the same branch",
      });
    }

    const newAccount = new AccountOpenForm({
      branchId: findBancBranchId._id,
      fullName,
      dateOfBirth,
      phoneNumber,
      email,
      gender,
      street,
      city,
      state,
      zipcode,
      identityProof,
      addressProof,
      occupation,
      incomeRange,
    });

    // populate the branchId in the response
    const populatedAccount = await newAccount.populate("branchId");

    // Save the new account open form
    const saveForm = await populatedAccount.save();

    return res
      .status(201)
      .json({ message: "Form Created Successfully", saveForm });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while creating account open form", error });
  }
};

// Function to get all pending account open forms
// This function retrieves all pending account open forms from the database

const getPendingAccountForms = async (req, res) => {
  try {
    const pendingForms = await AccountOpenForm.find();

    if (pendingForms.length === 0) {
      return res.status(404).json({ message: "Pending form list not found" });
    }

    return res.status(200).json({ message: "Pending forms", pendingForms });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching pending forms", error });
  }
};

// delete account open form by ID
const deleteAccountOpenForm = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the account open form by ID
    const deletedForm = await AccountOpenForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while deleting form", error });
  }
};

module.exports = {
  accountCreationForm,
  getPendingAccountForms,
  deleteAccountOpenForm,
};

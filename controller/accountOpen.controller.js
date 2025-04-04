const AccountOpenForm = require("../model/AccountOpenForm.model");

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
      accountType,
      initialDeposit,
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
      !zipcode ||
      !accountType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAccount = new AccountOpenForm({
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
      accountType,
      initialDeposit,
      identityProof,
      addressProof,
      occupation,
      incomeRange,
    });

    const saveForm = await newAccount.save();

    return res
      .status(201)
      .json({ message: "Form Created Successfully", saveForm });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while creating account open form", error });
  }
};

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

module.exports = { accountCreationForm, getPendingAccountForms };

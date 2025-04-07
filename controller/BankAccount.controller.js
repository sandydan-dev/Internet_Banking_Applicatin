const BankAccount = require("../model/BankAccount.model");
const AccountOpenForm = require("../model/AccountOpenForm.model");
const CustomerProfile = require("../model/CustomerProfile.model");

const createBankCustomerAccount = async (req, res) => {
  try {
    // get employeeId from the token
    const user = req.user;

    console.log("employee id: ", user.user);
    //todo:  get the data from the request body from the BankAccount model
    const { accountId, customerId, accountNumber, accountHolderId, status } =
      req.body;

    //todo:  check if the accountId is already exist in the database
    const isAccountIdExist = await BankAccount.findOne({
      accountId: accountId,
    });
    if (isAccountIdExist) {
      return res.status(400).json({
        message: "Account ID already exists",
      });
    }
    //todo:  check if the customerId is already exist in the database
    const isCustomerIdExist = await BankAccount.findOne({
      customerId: customerId,
    });
    if (isCustomerIdExist) {
      return res.status(400).json({
        message: "Customer ID already exists",
      });
    }
    //todo:  check if the accountNumber is already exist in the database
    const isAccountNumberExist = await BankAccount.findOne({
      accountNumber: accountNumber,
    });
    if (isAccountNumberExist) {
      return res.status(400).json({
        message: "Account Number already exists",
      });
    }
    //todo: check if the accountHolderId is already exist in the database
    const isAccountHolderIdExist = await BankAccount.findOne({
      accountHolderId: accountHolderId,
    });
    if (isAccountHolderIdExist) {
      return res.status(400).json({
        message: "Account Holder ID already exists",
      });
    }

    //todo check accountHolderId in the AccountOpenForm model, and update the status to active, and remarks to Account opened successfully
    const accountHolder = await AccountOpenForm.findByIdAndUpdate(
      accountHolderId,
      { status: "active", remarks: "Account opened successfully" },
      { new: true }
    );

    // stringify the user, so that it can be saved in the database
    const userString = JSON.stringify(user);

    // create a new bank account
    const newBankAccount = new BankAccount({
      accountHolderId: accountHolder._id,
      status,
      employeeId: userString, //todo: to check if the employeeId is the same as the one in the token
    });

    // populate the accountHolderId with the AccountOpenForm model
    const populatedAccount = await newBankAccount.populate("accountHolderId");

    // save the new bank account in the database
    const savedBankAccount = await populatedAccount.save();

    //todo: return success if all the data is valid
    return res.status(200).json({
      message: "Account created successfully",
      data: savedBankAccount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating bank account",
      error: error.message,
    });
  }
};

//todo: get all active bank accounts
const getAllActiveBankAccounts = async (req, res) => {
  try {
    // get all bank accounts from the database
    const allBankAccounts = await BankAccount.find({ status: "active" })
      .populate("accountHolderId")
      .populate("employeeId");

    // check if there are any bank accounts
    if (allBankAccounts.length === 0) {
      return res.status(404).json({
        message: "No pending bank accounts found",
      });
    }

    // return the bank accounts
    return res.status(200).json({
      message: "success",
      data: allBankAccounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting all bank accounts",
      error: error.message,
    });
  }
};

// todo: get all accounts by status pending
const getAllPendingBankAccounts = async (req, res) => {
  try {
    // get all bank accounts from the database
    const allBankAccounts = await BankAccount.find({ status: "pending" })
      .populate("accountHolderId")
      .populate("employeeId");

    // check if there are any bank accounts
    if (allBankAccounts.length === 0) {
      return res.status(404).json({
        message: "No pending bank accounts found",
      });
    }

    // return the bank accounts
    return res.status(200).json({
      message: "success",
      data: allBankAccounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting all bank accounts",
      error: error.message,
    });
  }
};

// get all account form by status pending
const getAllPendingAccountForms = async (req, res) => {
  try {
    // get all account open forms from the database
    const allAccountOpenForms = await AccountOpenForm.find({
      status: "pending",
    }).populate("branchId");

    // check if there are any account open forms
    if (allAccountOpenForms.length === 0) {
      return res.status(404).json({
        message: "No pending account open forms found",
      });
    }

    // return the account open forms
    return res.status(200).json({
      message: "success",
      data: allAccountOpenForms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting all account open forms",
      error: error.message,
    });
  }
};

// freeze the account by accountNumber which can customer cannot access the account add the functionalityto the controller
const freezeBankAccount = async (req, res) => {
  try {
    const id = req.params.id; // get the account number from the request params

    // find the account by account number
    const freezeAccount = await BankAccount.findOne({ accountNumber: id });
    if (!freezeAccount) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    // update the account status to freeze
    freezeAccount.status = "freeze";

    // javascript freeze account define property
    Object.defineProperty(freezeAccount, "status", {
      value: "freeze",
      writable: false, // it read only property
      configurable: false, 
      enumerable: true,
    });
    // save the account
    const savedAccount = await freezeAccount.save();
    return res.status(200).json({
      message: "Account frozen successfully",
      data: savedAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error freezing account",
      error: error.message,
    });
  }
};


// defreeze the account by accountNumber which can customer access the account add the functionalityto the controller
const defreezeBankAccount = async (req,res)=>{
  try {
     const id = req.params.id; // get the account number from the request params
    // find the account by account number

    const findAccountNumber = await BankAccount.findOne({ accountNumber: id });
    if (!findAccountNumber) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // update the account status to freeze
    findAccountNumber.status = "active";
    // javascript freeze account define property

    Object.defineProperty(findAccountNumber, "status", {
      value: "active",
      writable: true, // allow to change the value of the property
      configurable: false, // it is not configurable
      enumerable: true, 
    });
    // save the account
    const savedAccount = await findAccountNumber.save();
    return res.status(200).json({
      message: "Account defrozen successfully",
      data: savedAccount,
    });


  } catch (error) {
    
  }
}


// get all freeze bank accounts
const getAllFreezeBankAccounts = async (req, res) => {
  try {
    // get all bank accounts from the database
    const allBankAccounts = await BankAccount.find({
      status: "freeze",
    }).populate("accountHolderId");

    // check if there are any bank accounts
    if (allBankAccounts.length === 0) {
      return res.status(404).json({
        message: "No freeze bank accounts found",
      });
    }

    // return the bank accounts
    return res.status(200).json({
      message: "success",
      data: allBankAccounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting all freeze bank accounts",
      error: error.message,
    });
  }
};


module.exports = {
  createBankCustomerAccount,
  getAllActiveBankAccounts,
  getAllPendingBankAccounts,
  getAllPendingAccountForms,
  freezeBankAccount,
  defreezeBankAccount,
  getAllFreezeBankAccounts,
};

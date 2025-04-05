const BankAccount = require("../model/BankAccount.model");
const AccountOpenForm = require("../model/AccountOpenForm.model");
const BankBranch = require("../model/BankBranch.model");

const createBankCustomerAccount = async (req, res) => {
  try {
    // get employeeId from the token
    const user = req.user;

    console.log("employee id: ", user);
    //todo:  get the data from the request body from the BankAccount model
    const {
      accountId,
      customerId,
      accountNumber,
      accountHolderId,
      status,
      employeeId,
    } = req.body;

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

    // create a new bank account
    const newBankAccount = new BankAccount({
      status,
      employeeId: user, //todo: to check if the employeeId is the same as the one in the token
    });

    //todo: return success if all the data is valid
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating bank account",
      error: error.message,
    });
  }
};

module.exports = {
  createBankCustomerAccount,
};

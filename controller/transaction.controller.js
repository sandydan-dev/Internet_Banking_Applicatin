const BankAccount = require("../model/BankAccount.model");
const Transaction = require("../model/Transaction.model");

//todo: deposite money to BankAccount
const depositeMoneyToAccountNumber = async (req, res) => {
  try {
    const { accountNumber, amount, remarks } = req.body;

    // Validate deposit amount
    if (!accountNumber || !amount || amount <= 0) {
      return res.status(400).json({
        message:
          "Invalid input. Account number and a positive amount are required.",
      });
    }

    // Find the bank account by account number
    const account = await BankAccount.findOne({ accountNumber }).populate(
      "accountHolderId"
    );

    // If account is not found, return an error
    if (!account) {
      return res.status(404).json({
        message: "Account not found. Please check the account number.",
      });
    }

    // check if account is active
    if (account.status !== "active") {
      return res.status(400).json({
        message:
          "Account is not active, Please activate the account number before deposit",
      });
    }

    // fetch the account holder name from the accountHolderId
    const accountHolder = account.accountHolderId.fullName;

    // update the account balance
    account.balance = amount;
    const updatedAccount = await account.save();

    const newTransaction = await Transaction.create({
      receiverAccountNumber: account._id,
      accoountHolderName: accountHolder,
      amount,
      transactionType: "deposit",
      status: "completed",
      remarks,
    });

    return res.status(201).json({
      message: "Deposite successfully",
      account: updatedAccount,
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during the deposit process.",
      error: error.message,
    });
  }
};

// transfer money between both sender and receiver account

const transferMoneyBetweenAccounts = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount, remarks } =
      req.body;

    // validate input
    if (
      !senderAccountNumber ||
      !receiverAccountNumber ||
      !amount ||
      amount <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid input. Sender, receiver, and a positive amount are required.",
      });
    }

    // find the sender account number
    const senderAccount = await BankAccount.findOne({
      accountNumber: senderAccountNumber,
    }).populate({
      path: "accountHolderId",
      select: "fullName", // Fetch only the fullName field
    });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // check if the sender account is active
    if (senderAccount.status !== "active") {
      return res.status(400).json({
        message:
          "Sender account is not active, Please activate before deposite",
      });
    }

    // check if sender account has insufficient balance
    if (senderAccount.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in sender account" });
    }

    // find the receiver account
    const receiverAccount = await BankAccount.findOne({
      accountNumber: receiverAccountNumber,
    }).populate({
      path: "accountHolderId",
      select: "fullName", // Fetch only the fullName field
    });

    // if receiver account not found
    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    // check if receiver account is active
    if (receiverAccount.status !== "active") {
      return res.status(400).json({
        message:
          "Receiver account is not active, Please activate before deposite",
      });
    }

    // fetch the account holder name
    const senderName = await senderAccount.accountHolderId.fullName;

    if (senderAccount.accountHolderId.fullName !== senderName) {
      return res.status(400).json({
        message: `Sender account number and account holder name do not match.`,
      });
    }

    // deduct the amount from the sender account
    senderAccount.balance -= amount;
    const updatedSenderAccount = await senderAccount.save();

    // add the the amount to receiver account
    receiverAccount.balance += amount;
    const updatedReceiverAccount = await receiverAccount.save();

    // transaction account to account
    const newTransaction = await Transaction.create({
      senderAccountNumber: senderAccount._id,
      receiverAccountNumber: receiverAccount._id,
      accoountHolderName: `Sender: ${senderName}`,
      amount,
      transactionType: "transfer",
      status: "completed",
      remarks,
    });

    // if all transaction is good return success response
    return res.status(201).json({
      message: "Transfer Successfully",
      senderAccount: updatedSenderAccount,
      receiverAccount: updatedReceiverAccount,
      transaction: newTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during the transfer process.",
      error: error.message,
    });
  }
};

module.exports = {
  depositeMoneyToAccountNumber,
  transferMoneyBetweenAccounts,
};

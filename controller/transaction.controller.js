const BankAccount = require("../model/BankAccount.model");
const Transaction = require("../model/Transaction.model");
const TransactionHistory = require("../model/TransactionHistory.model");

//todo: deposite money to BankAccount  ✅
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

    // If account is not found
    if (!account) {
      return res.status(404).json({
        message: "Account not found. Please check the account number.",
      });
    }

    // Check if account is not active
    if (account.status !== "active") {
      return res.status(400).json({
        message:
          "Account is not active, Please activate the account number before deposit",
      });
    }

    // Fetch the account holder name from the accountHolderId
    const accountHolder = account.accountHolderId.fullName;

    // Update the account balance by adding the deposit amount
    account.balance += amount; // Add the new amount to the existing balance
    const updatedAccount = await account.save();

    // Create a new deposit transaction
    const newTransaction = await Transaction.create({
      receiverAccountNumber: account.accountNumber,
      accoountHolderName: accountHolder, // holder name
      amount, // deposit amount
      transactionType: "deposit",
      status: "completed",
      remarks,
    });

    // Dynamically add transaction history
    await TransactionHistory.create({
      receiverAccountNumber: account.accountNumber, // Receiver's account number
      accoountHolderName: accountHolder, // Receiver's account number
      transactionType: "deposit",
      amount,
      status: "completed",
      remarks,
      depositedBy: accountHolder, // Use the receiver's name as the depositor
    });

    return res.status(201).json({
      message: "Deposit successfully",
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

//todo: transfer money between both sender and receiver account  ✅
const transferMoneyBetweenAccounts = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount, remarks } =
      req.body;

    // Validate input
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

    // Find the sender account
    const senderAccount = await BankAccount.findOne({
      accountNumber: senderAccountNumber,
    }).populate("accountHolderId");

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Check if the sender account is active
    if (senderAccount.status !== "active") {
      return res.status(400).json({
        message:
          "Sender account is not active, Please activate before transfer",
      });
    }

    // Check if sender account has insufficient balance
    if (senderAccount.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in sender account" });
    }

    // Find the receiver account
    const receiverAccount = await BankAccount.findOne({
      accountNumber: receiverAccountNumber,
    }).populate("accountHolderId");

    // If receiver account not found
    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    // Check if receiver account is active
    if (receiverAccount.status !== "active") {
      return res.status(400).json({
        message:
          "Receiver account is not active, Please activate before transfer",
      });
    }

    // Fetch the sender and receiver names
    const senderName = senderAccount.accountHolderId.fullName;
    const receiverName = receiverAccount.accountHolderId.fullName;

    // Deduct the amount from the sender account
    senderAccount.balance -= amount;
    const updatedSenderAccount = await senderAccount.save();

    // Add the amount to the receiver account
    receiverAccount.balance += amount;
    const updatedReceiverAccount = await receiverAccount.save();

    // Create a new transaction
    const newTransaction = await Transaction.create({
      senderAccountNumber: senderAccount.accountNumber,
      receiverAccountNumber: receiverAccount.accountNumber,
      accoountHolderName: `Sender: ${senderName}, Receiver: ${receiverName}`,
      amount,
      transactionType: "transfer",
      status: "completed",
      remarks,
    });

    // Dynamically add a single transaction history entry for sender
    await TransactionHistory.create({
      senderAccountNumber: senderAccount.accountNumber,
      receiverAccountNumber: receiverAccount.accountNumber,
      holderName: senderName, // Add sender's name
      transactionType: "account_to_account",
      amount,
      status: "completed",
      remarks,
      depositedBy: senderName, // Sender's name
      transactionDescription: `Sender: ${senderName} transferred ${amount} to Receiver: ${receiverName}`,
    });

    // Dynamically add a transaction history entry for the receiver
    await TransactionHistory.create({
      senderAccountNumber: senderAccount.accountNumber, // sender account number
      receiverAccountNumber: receiverAccount.accountNumber, // receiver account number
      holderName: receiverName, // Add receiver's name
      transactionType: "account_to_account",
      amount,
      status: "completed",
      remarks,
      depositedBy: senderName, // Sender's name
      transactionDescription: `Receiver: ${receiverName} received ${amount} from Sender: ${senderName}`, // Add description
    });

    // If all transactions are successful, return success response
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

const BankAccount = require("../model/BankAccount.model");
const Card = require("../model/Card.model");
const TransactionHistory = require("../model/TransactionHistory.model");

//todo: activate card number for customer
const activateCardNumber = async (req, res) => {
  try {
    const { cardHolderName, cardType, status } = req.body;
    const accountNumber = req.params.accountNumber;
    const bankAccount = await BankAccount.findOne({ accountNumber }).populate(
      "accountHolderId"
    );

    // check if bank accout is available
    if (bankAccount.length === 0) {
      return res.status(404).json({ message: "Bank account not found!" });
    }

    // if banck account is available with status code active
    if (bankAccount.status !== "active") {
      return res
        .status(400)
        .json({ message: "bank account status is not active" });
    }

    // account holder details
    const account_holder = bankAccount.accountHolderId;

    // Check if cardNumber is already allocated
    const existingCard = await Card.findOne({
      customerId: bankAccount.customerId,
    });
    if (existingCard) {
      return res.status(400).json({
        message: "Card number is already allocated to this customer.",
      });
    }

    // generate new card number for customer
    const newCard = await Card.create({
      customerId: bankAccount.customerId, // Use the customerId directly from bankAccount
      cardHolderName: account_holder.fullName,
      cardType,
      status,
    });

    const saveCard = await newCard.save();
    console.log("New card created", saveCard);
    return res
      .status(201)
      .json({ message: "New Card Generated Successfully", saveCard });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while activating the card.",
      error: error.message,
    });
  }
};

//todo: Get all cards details

const getAllCardsDetails = async (req, res) => {
  try {
    const cards = await Card.find();

    if (cards.length === 0) {
      return res.status(404).json({ message: "Card list not found" });
    }

    return res.status(200).json({ message: "Card lists", cards });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting all card details", error });
  }
};

//todo: block card if customer want to block permanently
const CardNumberBlockOrActive = async (req, res) => {
  try {
    const cardNumber = req.params.cardNumber;
    const { status } = req.body; // Get status from request body

    // Find the card by cardNumber
    const card = await Card.findOne({ cardNumber });

    // If card number not found
    if (!card) {
      return res.status(404).json({ message: "Card number not found" });
    }

    // If the card already has the requested status
    if (card.status === status) {
      return res.status(400).json({
        message: `Card is already in the status: ${status}.`,
      });
    }

    // Update the card status dynamically with validation
    const updatedCard = await Card.findOneAndUpdate(
      { cardNumber },
      { status }, //
      { new: true, runValidators: true } // Enable validation
    );

    console.log("Updated card:", updatedCard);

    return res.status(200).json({
      message: `Card status has been updated to ${status} successfully.`,
      card: updatedCard,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error while updating card status:");

    return res.status(500).json({
      message: "Error while updating card status",
      error: error.message,
    });
  }
};

//todo: find only blocked card number

const findCardsByStatus = async (req, res) => {
  try {
    const status = req.params.status; // Get status from request parameters

    // Find cards with the specified status
    const cards = await Card.find({ status });

    // If no cards are found with the given status
    if (cards.length === 0) {
      return res
        .status(404)
        .json({ message: `No cards found with status: ${status}` });
    }

    return res
      .status(200)
      .json({ message: `Cards with status: ${status}`, cards });
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting cards by status",
      error: error.message,
    });
  }
};

// Transfer money from one card to another
const transferCardToCard = async (req, res) => {
  try {
    // get data from body model
    const { fromCardNumber, toCardNumber, amount, cvv } = req.body;

    // Find the sender card number to transfer to another card number
    const fromCard = await Card.findOne({ cardNumber: fromCardNumber }); // sender card number
    const toCard = await Card.findOne({ cardNumber: toCardNumber }); // receiver card number

    // check if sender card number not found
    if (!fromCard) {
      return res.status(404).json({ message: "Sender card number not found" });
    }

    // check if receiver card number not found
    if (!toCard) {
      return res
        .status(404)
        .json({ message: "Receiver card number not found" });
    }

    // Validate if CVV for the sender card
    if (fromCard.cvv !== cvv) {
      return res
        .status(400)
        .json({ message: "Invalid CVV for the source card." });
    }

    // Find the bank accounts for the sender and receiver bank account to match with the customerId

    // sender bank customerId to match with card customerId
    const fromBankAccount = await BankAccount.findOne({
      customerId: fromCard.customerId,
    });

    // receiver bank customerId to match with card customerId
    const toBankAccount = await BankAccount.findOne({
      customerId: toCard.customerId,
    });

    // sender bank customerId not match with the card customerId
    if (!fromBankAccount) {
      return res.status(404).json({
        message: "Sender Bank customerId not match with the card customerId ",
      });
    }

    // sender bank customerId not match with the card customerId
    if (!toBankAccount) {
      return res.status(404).json({
        message: "Receiver Bank customerId not match with the card customerId ",
      });
    }

    // Check if the source bank account has sufficient balance
    if (fromBankAccount.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance in the receiver bank account.",
      });
    }

    // Perform the transfer
    fromBankAccount.balance -= amount; // Deduct from sender bank account
    toBankAccount.balance += amount; // Add to receiver bank account

    // Save the updated bank accounts
    await fromBankAccount.save();
    await toBankAccount.save();

    // Dynamically add transaction history for sender
    await TransactionHistory.create({
      cardId: fromCard._id,
      transactionType: "card_to_card",
      senderCardId: fromCard._id,
      receiverCardId: toCard._id,
      amount,
      status: "completed",
    });

    // Dynamically add transaction history for receiver
    await TransactionHistory.create({
      cardId: toCard._id,
      transactionType: "card_to_card",
      senderCardId: fromCard._id,
      receiverCardId: toCard._id,
      amount,
      status: "completed",
    });

    return res.status(201).json({
      message: "Transfer successful.",
      fromBankAccount: {
        accountNumber: fromBankAccount.accountNumber,
        balance: fromBankAccount.balance,
      },
      toBankAccount: {
        accountNumber: toBankAccount.accountNumber,
        balance: toBankAccount.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during card-to-card transfer.",
      error: error.message,
    });
  }
};

// Transfer money from a card to a bank account
const transferCardToAccount = async (req, res) => {
  try {
    const { cardNumber, accountNumber, amount, cvv } = req.body;

    // Find the card and the bank account
    const card = await Card.findOne({ cardNumber }); // sender card
    const bankAccount = await BankAccount.findOne({ accountNumber }); // receiver bank account

    // Check if the card exists
    if (!card) {
      return res.status(404).json({ message: "Card number not found." });
    }

    // Check if the bank account exists
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found." });
    }

    // Validate CVV
    if (card.cvv !== cvv) {
      return res.status(400).json({ message: "Invalid CVV for the card." });
    }

    // Check if the customerId of the card matches the customerId of the bank account
    if (!card.customerId) {
      return res.status(400).json({
        message:
          "Customer ID of the card does not match the customer ID of the bank account.",
      });
    }

    // Find the bank account sender with the card
    const fromBankAccount = await BankAccount.findOne({
      customerId: card.customerId,
    });

    // Check if the card's associated bank account has sufficient balance
    if (!fromBankAccount || fromBankAccount.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance in the card's associated bank account.",
      });
    }

    // Perform the transfer
    fromBankAccount.balance -= amount; // Deduct from the card's associated bank account
    bankAccount.balance += amount; // Add to the receiver bank account

    // Save the updated bank accounts
    await fromBankAccount.save();
    await bankAccount.save();

    // Dynamically add transaction history
    await TransactionHistory.create({
      cardId: card._id,
      transactionType: "card_to_account",
      senderCardId: card._id,
      receiverAccountId: bankAccount._id,
      amount,
      status: "completed",
    });

    return res.status(200).json({
      message: "Transfer successful.",
      fromBankAccount: {
        accountNumber: fromBankAccount.accountNumber,
        balance: fromBankAccount.balance,
      },
      toBankAccount: {
        accountNumber: bankAccount.accountNumber,
        balance: bankAccount.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during card-to-account transfer.",
      error: error.message,
    });
  }
};

// Transfer money from a bank account to a card
const transferAccountToCard = async (req, res) => {
  try {
    const { accountNumber, cardNumber, amount } = req.body;

    // Find the bank account and the card
    const bankAccount = await BankAccount.findOne({ accountNumber }); // Sender bank account
    const card = await Card.findOne({ cardNumber }); // Receiver card

    // Check if the bank account exists
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found." });
    }

    // Check if the card exists
    if (!card) {
      return res.status(404).json({ message: "Card number not found." });
    }

    // Validate if the customerId of the bank account matches the customerId of the card
    if (!bankAccount.customerId) {
      return res.status(400).json({
        message:
          "Customer ID of the bank account does not match the customer ID of the card.",
      });
    }

    // Check if the bank account has sufficient balance
    if (bankAccount.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in the bank account." });
    }

    const receiverBankAccount = await BankAccount.findOne({
      customerId: card.customerId,
    });
    if (!receiverBankAccount) {
      return res
        .status(404)
        .json({ message: "Receiver's associated bank account not found." });
    }

    // Perform the transfer
    bankAccount.balance -= amount; // Deduct from the sender bank account
    receiverBankAccount.balance += amount; // Add to the receiver's associated bank account

    // Save the updated bank accounts
    await bankAccount.save();
    await receiverBankAccount.save();

    // Dynamically add transaction history
    await TransactionHistory.create({
      accountId: bankAccount._id,
      transactionType: "account_to_card",
      senderAccountId: bankAccount._id,
      receiverCardId: card._id,
      amount,
      status: "completed",
    });

    return res.status(200).json({
      message: "Transfer successful.",
      fromBankAccount: {
        accountNumber: bankAccount.accountNumber,
        balance: bankAccount.balance,
      },
      toBankAccount: {
        accountNumber: receiverBankAccount.accountNumber,
        balance: receiverBankAccount.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during account-to-card transfer.",
      error: error.message,
    });
  }
};

module.exports = {
  activateCardNumber,
  getAllCardsDetails,
  CardNumberBlockOrActive,
  findCardsByStatus,
  transferCardToCard,
  transferCardToAccount,
  transferAccountToCard,
};

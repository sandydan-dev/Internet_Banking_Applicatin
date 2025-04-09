const BankAccount = require("../model/BankAccount.model");
const Card = require("../model/Card.model");

// activate card number for customer
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
      .status(200)
      .json({ message: "New Card Generated Successfully", saveCard });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while activating the card.",
      error: error.message,
    });
  }
};

module.exports = {
  activateCardNumber,
};

const express = require("express");
const router = express.Router();

// middleware
const verifyToken = require("../middleware/jwt.middleware");
const authorizeRole = require("../middleware/checkRole");

const {
  activateCardNumber,
  getAllCardsDetails,
  CardNumberBlockOrActive,
  findCardsByStatus,
  transferCardToCard,
  transferCardToAccount,
  transferAccountToCard,
} = require("../controller/card.controller");

//todo: routes

//todo: activated car number route
// endpoint : http://localhost:4002/api/v1/card_transaction/activate_card/:accountNumber
router.post(
  "/activate_card/:accountNumber",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  activateCardNumber
);

//todo : Card lists
// endpoint : http://localhost:4002/api/v1/card_transaction/card_details
router.get(
  "/card_details",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  getAllCardsDetails
);

//todo block card number
// endpoint : http://localhost:4002/api/v1/card_transaction/card_block
router.patch(
  "/card_block/:cardNumber",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  CardNumberBlockOrActive
);

//todo: find card by status
// endpoint : http://localhost:4002/api/v1/card_transaction/block/blocked
router.get(
  "/block/:status",
  verifyToken,
  authorizeRole(["employee", "admin"]),
  findCardsByStatus
);

//todo: card to card
// endpoint : http://localhost:4002/api/v1/card_transaction/card_to_card
router.post(
  "/card_to_card",
  verifyToken,
  authorizeRole(["customer","employee", "admin"]),
  transferCardToCard
);

//todo: card to account
// endpoint : http://localhost:4002/api/v1/card_transaction/card_to_account
router.post(
  "/card_to_account",
  verifyToken,
  authorizeRole(["customer","employee", "admin"]),
  transferCardToAccount
);

//todo: account to card
// endpoint : http://localhost:4002/api/v1/card_transaction/account_to_card
router.post(
  "/account_to_card",
  verifyToken,
  authorizeRole(["customer","employee", "admin"]),
  transferAccountToCard
);

// exports router
module.exports = router;

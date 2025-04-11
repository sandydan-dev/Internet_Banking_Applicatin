const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectionDatabase = require("./config/database.connection");

// routers path
const branchRouter = require("./route/bankBranch.route");
const accountOpenRouter = require("./route/accountOpen.route");
const customerProfileRouter = require("./route/customerProfile.route");
const bankAccountRouter = require("./route/bankAccount.route");
const transactionRouter = require("./route/transaction.route");
const cardRouter = require('./route/card.route')


// connection database
connectionDatabase();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hellye user");
});

//todo: main routes

//todo: bank branch routes ✅
app.use("/api/v1/branch", branchRouter);

//todo: customer profile routes ✅
app.use("/api/v1/customer_profile", customerProfileRouter);

//todo: account open form routes ✅
app.use("/api/v1/account_form", accountOpenRouter);

//todo bank account routes ✅
app.use("/api/v1/bank_account", bankAccountRouter);

//todo: transaction account route, for deposite, withdraw, acc to acc ✅
app.use("/api/v1/transaction", transactionRouter);

//todo : card to card transfer money to bank account
app.use('/api/v1/card_transaction', cardRouter)


module.exports = { app };

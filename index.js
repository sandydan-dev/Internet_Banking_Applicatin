const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectionDatabase = require("./config/database.connection");

// routers path
const branchRouter = require("./route/bankBranch.route");
const accountOpenRouter = require("./route/accountOpen.route");
const customerProfileRouter = require('./route/customerProfile.route')

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

// main routes
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/account_form", accountOpenRouter);
app.use('/api/v1/customer_profile', customerProfileRouter)

module.exports = { app };

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectionDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connection successfully", process.env.NODE_ENV);
    })
    .catch((error) => {
      console.log("Error while connection to database", error);
    });
};

module.exports = connectionDatabase;

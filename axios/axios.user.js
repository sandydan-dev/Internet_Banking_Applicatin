const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.USER_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

module.exports = axiosInstance;

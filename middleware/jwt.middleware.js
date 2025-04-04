const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    // Debugging log: Check received token
    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Debugging log: Check secret key
    console.log("JWT Secret Key:", process.env.JWT_SECRET_KEY);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Debugging log: Check decoded token
    console.log("Decoded Token:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Debugging log
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Error while verifying token" });
  }
};

module.exports = verifyToken;

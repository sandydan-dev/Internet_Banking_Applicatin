const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authorizeRole = (allowRole) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // console.log("Decoded Token in authorizeRole:", decoded); // Debugging log
      // console.log("User Role:", decoded.role); // Debugging log

      if (!allowRole.includes(decoded.role)) {
        return res.status(403).json({
          message: "Access Denied, you don't have insufficient permissions",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed" });
    }
  };
};

module.exports = authorizeRole;

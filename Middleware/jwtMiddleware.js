const jwt = require("jsonwebtoken");
const users = require("../models/userModel"); // Ensure the correct path to your user model

const jwtMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const jwtResponse = jwt.verify(token,"supersecretkey123");
    req.payload = jwtResponse._id;
    console.log(jwtResponse)

    const userData = await users.findOne({  _id: req.payload });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userData.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = jwtMiddleware;
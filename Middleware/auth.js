const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not authorixed login again" });
  }
  try {
    const token_decode = jwt.verify(token, "supersecretkey123");
    req.body.userId = token_decode._id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

module.exports = authMiddleware;

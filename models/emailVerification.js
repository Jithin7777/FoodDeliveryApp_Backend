const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("emailOTPVerification", emailSchema);

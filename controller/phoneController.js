require("dotenv").config;
const twilio = require("twilio");
const phoneSchema = require("../models/phoneVerification");
const user = require("../models/userModel");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

exports.sendPhoneOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();

  // Save OTP to MongoDB
  const phoneOtpDocument = new phoneSchema({ phone, otp });

  try {
    await phoneSchema.deleteMany({ phone });
    await phoneOtpDocument.save();
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });
    res.send({ success: true, otp: otp });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Failed to send OTP" });
  }
};




exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { otp, phone } = req.body;

    const existingOtpEntry = await phoneSchema.findOne({ phone, otp });
    console.log(existingOtpEntry);

    if (!existingOtpEntry) {
      return res.status(404).json({ error: "OTP not found" });
    }

    if (existingOtpEntry.expiresAt < Date.now()) {
      await phoneSchema.deleteMany({ phone, otp });
      return res.status(410).json({ error: "OTP expired" });
    }

    const userRecord = await user.findOne({ phone });

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    userRecord.phoneVerification = true;
    const updatedUser = await userRecord.save();

    await phoneSchema.deleteMany({ phone, otp });

    return res.status(200).json({
      message: "Phone verified successfully",
      user: updatedUser,
      otpVerified: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exports;

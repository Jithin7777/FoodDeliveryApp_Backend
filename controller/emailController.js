const emailSchema = require("../models/emailVerification");
const user = require("../models/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

//create Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (req, res) => {
  const otp = Math.floor(Math.random() * 900000) + 100000;
  try {
    const { email } = req.body;
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Email Verification",
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Roboto', Arial, sans-serif; 
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 20px;
                  color: #000000; /* Black font color */
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  background-color: #ff7f50;
                  color: #ffffff;
                  padding: 15px;
                  border-top-left-radius: 10px;
                  border-top-right-radius: 10px;
                  text-align: center;
                }
                .content {
                  padding: 20px;
                  line-height: 1.6;
                  
                }
                .otp-container {
                  background-color: #ff6347;
                  color: #ffffff;
                  padding: 15px;
                  text-align: center;
                  border-radius: 5px;
                  margin: 20px auto;
                  width: 150px;
                  font-size: 24px;
                  font-family: 'Roboto', Arial, sans-serif; /* Updated font family */
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="font-size: 28px;">OTP Verification</h1>
                </div>
                <div class="content">
                  <p style="font-size: 16px;">Dear User,</p>
                  <p style="font-size: 16px;">Your One-Time Password (OTP) for verifying your email address is:</p>
                  <div class="otp-container">${otp}</div>
                  <p style="font-size: 16px;">Please enter this OTP to complete your email verification. This OTP is valid for <b>5 MINUTES</b>.</p>
                  <p style="font-size: 16px;">Best regards,<br/>FoodApp Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
    };
    // const salt = await bcrypt.genSalt(10);
    // const hashedOtp = await bcrypt.hash(otp.toString(), salt);

    const newVerification = await new emailSchema({
      // userId: _id,
      email,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000, // Set expiration time 5 minutes from now
    });
    await emailSchema.deleteMany({ email });
    await newVerification.save();

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.status(200).json({ OTP: otp });
      }
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json("Error sending email");
  }
};

// verify otp
exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const existingUser = await emailSchema.findOne({ email, otp });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser.expiresAt < Date.now()) {
      return res.status(410).json({ error: "OTP expired" });
    }

    // Uncomment if you need to compare hashed OTPs
    // const validOtp = await bcrypt.compare(otp, existingUser.otp);
    // if (!validOtp) {
    //   return res.status(400).json({ error: "Incorrect OTP" });
    // }

    const userd = await user.findOne({ email });
    if (!userd) {
      return res.status(404).json({ error: "User not found" });
    }

    userd.emailVerification = true;
    const updatedUser = await userd.save();

    return res.status(200).json({
      message: "Email verified successfully",
      user: updatedUser,
      otpVerified: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exports;

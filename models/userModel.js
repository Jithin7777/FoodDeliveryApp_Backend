const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    profilePic: {
      type: String,
      default: "",
    },

    emailVerification: {
      type: Boolean,
      default: false,
    },
    phoneVerification: {
      type: Boolean,
      default: false,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

module.exports = mongoose.model("users", userSchema);

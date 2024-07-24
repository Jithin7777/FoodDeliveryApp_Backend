const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// exports.register = async (req, res) => {
//     const { username, email, password, phone } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(406).json("Account already exists, Please Login");
//         }

//         // Encrypt password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password,salt);

//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             phone,

//         });

//         await newUser.save();
//         res.status(200).json(newUser);
//     } catch (err) {
//         console.error(`Register API failed, Error: ${err}`);
//         res.status(400).json({ message: `Register API failed, Error: ${err}` });
//     }
// };

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET);
// }

exports.register = async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res
        .status(406)
        .json({ success: false, message: "User already exists" });
    }

    // Validating email format and password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    const user = await newUser.save();
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      // Compare the hashed password with the provided password
      const validPassword = await bcrypt.compare(password, existUser.password);
      if (validPassword) {
        // Generate token if the password is valid
        const token = jwt.sign({ _id: existUser._id }, "supersecretkey123");
        console.log(token);
        return res.status(200).json({ user: existUser, token });
      } else {
        return res.status(404).json("Incorrect email or password");
      }
    } else {
      return res.status(404).json("Incorrect email or password");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json(`Login API failed ${error}`);
  }
};

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const existUser = await User.findOne({email});
//         if (existUser) {
//             // Compare the hashed password with the provided password
//             const validPassword = await bcrypt.compare(password, existUser.password);
//             if (validPassword) {
//                 // Generate token if the password is valid
//                 const token = jwt.sign({ _id: existUser._id }, "supersecretkey123");
//                 console.log(token);
//                 res.status(200).json({ user: existUser, token });
//             } else {
//                 res.status(404).json("Incorrect email or password");
//             }
//         } else {
//             res.status(404).json("Incorrect email or password");
//         }
//     } catch (error) {
//         res.status(401).json(`Login API failed ${error}`);
//     }
// };

exports.googleLogin = async (req, res) => {
  const { email, username, profilePic } = req.body;
  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      req.session.user = {
        _id: existingUser._id,
        userName: existingUser.username,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
      };
      res.status(200).json({ user: req.session.user });
    } else {
      const newUser = new User({
        username,
        email,
        profilePic,
      });
      await newUser.save();

      req.session.user = {
        _id: newUser._id,
        userName: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      };
      res.status(200).json({ user: req.session.user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
};

exports.dummyAPI = async (req, res) => {
  try {
    res.status(200).json({ userId: req.payload, message: "Admin accessed!!" });
  } catch (err) {
    res.status(401).json(err);
  }
};



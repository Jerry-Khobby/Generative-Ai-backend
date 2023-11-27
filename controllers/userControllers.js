const bcrypt = require('bcrypt');
const User = require("../models/schema");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("This user already exists");
      return res.status(409).json({ error: "Email address is already in use" });
    }

    const newHashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: newHashed,
    });

    console.log("The new user created:", newUser);
    await newUser.save();

    jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '360h' }, (err, token) => {
      if (err) {
        console.error("Error signing JWT token:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // Respond with the token and any additional user information you want to include
      res.cookie('token', token, { sameSite: 'none', secure: true,httpOnly:true }).status(201).json({
        id: newUser._id,
        message: "User registered successfully",
        token,
        user: {
          userId: newUser._id,
          email: newUser.email,
          // Include other user information as needed
        },
      });
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// the logic for loggin a user 
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("This user does not exist");
      return res.status(401).json({ error: "This user does not exist" });
    }
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      console.log("The password does not match");
      return res.status(401).json({ error: "Invalid  password" });
    }
    jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '360h' }, (err, token) => {
      if (err) {
        console.error("Error signing JWT token:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.cookie('token', token, { sameSite: 'none', secure: true,httpOnly:true}).status(200).json({
        id: existingUser._id,
        message: "User logged in successfully",
        token,
        user: {
          userId: existingUser._id,
          email: existingUser.email,
          // Include other user information as needed
          firstname:existingUser.firstname,
          lastname:existingUser.lastname,
        },
      });
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService.js";

// ✅ REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    // ✅ send welcome email
    try {
      await sendEmail(
        email,
        "Welcome to SoilSense",
        `Hello ${name}, your account has been created successfully!`
      );
    } catch (emailError) {
      console.log("Email error:", emailError.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ========================================= */

// ✅ LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.json({
  message: "Login successful",
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

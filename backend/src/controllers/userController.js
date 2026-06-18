import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService.js";


/* ================================
   ✅ REGISTER USER
================================ */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "student"
    });

    // ✅ Send welcome email (optional)
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
      message: "✅ User registered successfully",
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


/* ================================
   ✅ LOGIN USER
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login successful",
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


/* ================================
   ✅ GET ALL USERS (OPTIONAL FILTER)
================================ */
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    // ✅ optional filter
    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-passwordHash");

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ GET ONLY STUDENTS
================================ */
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      status: "active"
    }).select("name email");

    res.json(students);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ GET USER BY ID
================================ */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-passwordHash");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ UPDATE USER
================================ */
export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ If updating password, hash it
    if (req.body.password) {
      updateData.passwordHash = await bcrypt.hash(req.body.password, 10);
      delete updateData.password;
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-passwordHash");

    if (!updated) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      message: "✅ User updated successfully",
      user: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ DELETE USER
================================ */
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      message: "✅ User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
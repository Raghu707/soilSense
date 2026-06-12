import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "supervisor", "student"],
    default: "student"
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
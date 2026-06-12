import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: String,
  description: String,
  location: String,

  startDate: Date,

  // ✅ NEW FIELD
  endDate: Date,

  // ✅ NEW FIELD
  status: {
    type: String,
    enum: ["active", "paused", "completed"],
    default: "active"
  }

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
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

  
// ✅ ADD THIS
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ✅ ADD THIS
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true
  },

  // ✅ NEW FIELD
  endDate: Date,

  // ✅ NEW FIELD

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
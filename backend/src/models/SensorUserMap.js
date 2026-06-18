// models/SensorStudentMap.js
import mongoose from "mongoose";

const sensorStudentMapSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("SensorStudentMap", sensorStudentMapSchema);

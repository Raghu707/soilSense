import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: {
    type: String,
    required: true
  },

  description: String,
  location: String,

  startDate: Date,
  endDate: Date,

  // ✅ MULTIPLE STUDENTS
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // ✅ MULTIPLE SENSORS
  sensors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor"
    }
  ]

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
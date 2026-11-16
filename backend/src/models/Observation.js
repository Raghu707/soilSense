import mongoose from "mongoose";

const observationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sensorReadingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawSensorReading",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: String,
  weather: String,
  wind: String,
  notes: String

}, { timestamps: true });

export default mongoose.model("Observation", observationSchema);
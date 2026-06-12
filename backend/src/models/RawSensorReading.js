import mongoose from "mongoose";

const rawSensorReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },

  temperatureC: Number,
  humidity: Number,
  battery: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("RawSensorReading", rawSensorReadingSchema);
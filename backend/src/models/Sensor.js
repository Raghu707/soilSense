import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

  fetchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  metalDescription: {
    type: String,
    default: ""
  },

  materialDescription: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

export default mongoose.model("Sensor", sensorSchema);
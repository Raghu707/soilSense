import Sensor from "../models/Sensor.js";
import { fetchTuyaData } from "../services/tuyaService.js";
import { sendEmail } from "../services/emailService.js";

/* ================================
   ✅ CREATE SENSOR
================================ */
export const createSensor = async (req, res) => {
  try {
    const sensor = await Sensor.create({
      ...req.body,
      fetchedBy: req.user.id
    });

    res.json({
      _id: sensor._id,
      deviceId: sensor.deviceId,
      projectId: sensor.projectId,
      metalDescription: sensor.metalDescription,
      materialDescription: sensor.materialDescription,
      fetchedBy: sensor.fetchedBy
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ GET ALL SENSORS (SORTED)
================================ */
export const getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find()
      .populate("projectId", "name location")
      .populate("fetchedBy", "name email")
      .sort({ createdAt: -1 });

    const cleanSensors = sensors.map(s => ({
      _id: s._id,
      deviceId: s.deviceId,
      project: s.projectId,
      fetchedBy: s.fetchedBy,
      metalDescription: s.metalDescription,
      materialDescription: s.materialDescription,
      moisture: s.moisture,
      temperature: s.temperature,
      humidity: s.humidity,
      battery: s.battery,
      fetchedAt: s.fetchedAt
    }));

    res.json(cleanSensors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ GET SINGLE SENSOR
================================ */
export const getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id)
      .populate("projectId", "name location")
      .populate("fetchedBy", "name email");

    if (!sensor) {
      return res.status(404).json({ msg: "Sensor not found" });
    }

    res.json({
      _id: sensor._id,
      deviceId: sensor.deviceId,
      project: sensor.projectId,
      fetchedBy: sensor.fetchedBy,
      metalDescription: sensor.metalDescription,
      materialDescription: sensor.materialDescription,
      moisture: sensor.moisture,
      temperature: sensor.temperature,
      humidity: sensor.humidity,
      battery: sensor.battery,
      fetchedAt: sensor.fetchedAt
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ UPDATE SENSOR
================================ */
export const updateSensor = async (req, res) => {
  try {
    const updated = await Sensor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Sensor not found" });
    }

    res.json({
      _id: updated._id,
      deviceId: updated.deviceId,
      metalDescription: updated.metalDescription,
      materialDescription: updated.materialDescription
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ DELETE SENSOR
================================ */
export const deleteSensor = async (req, res) => {
  try {
    const deleted = await Sensor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Sensor not found" });
    }

    res.json({ msg: "✅ Sensor deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ FETCH SENSOR DATA (TUYA)
================================ */

export const fetchSensorData = async (req, res) => {
  try {
    const deviceId = "bf6d48b94e308eb512d9ck";

    const data = await fetchTuyaData(deviceId);

    let moisture = null;
    let temperature = null;
    let battery = null;

    data.forEach(item => {
      if (item.code === "humidity_value") moisture = item.value;
      if (item.code === "temp_current") temperature = item.value / 10;
      if (item.code === "battery_state") battery = item.value;
    });

    res.json({ moisture, temperature, battery });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

import RawSensorReading from "../models/RawSensorReading.js";
import Sensor from "../models/Sensor.js";

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.TUYA_CLIENT_ID;
const CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET;
const DEVICE_ID = process.env.DEVICE_ID;
const HOST = process.env.TUYA_BASE_HOST;

// ✅ Empty body hash (required by Tuya)
const EMPTY_HASH =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";


// ✅ SIGN FUNCTION (CORRECT VERSION)
function sign({ t, method, path, token }) {
  const str = token
    ? CLIENT_ID + token + t + `${method}\n${EMPTY_HASH}\n\n${path}`
    : CLIENT_ID + t + `${method}\n${EMPTY_HASH}\n\n${path}`;

  return crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(str)
    .digest("hex")
    .toUpperCase();
}


// ✅ STEP 1: GET TOKEN
async function getToken() {
  const t = Date.now().toString();
  const path = "/v1.0/token?grant_type=1";

  const response = await axios.get(`https://${HOST}${path}`, {
    headers: {
      client_id: CLIENT_ID,
      sign_method: "HMAC-SHA256",
      t,
      sign: sign({ t, method: "GET", path })
    }
  });

  return response.data.result.access_token;
}


// ✅ STEP 2: FETCH SENSOR DATA + STORE IN DB
router.get("/data", async (req, res) => {
  try {
    const token = await getToken();

    const t = Date.now().toString();
    const path = `/v1.0/iot-03/devices/${DEVICE_ID}/status`;

    const response = await axios.get(`https://${HOST}${path}`, {
      headers: {
        client_id: CLIENT_ID,
        access_token: token,
        sign_method: "HMAC-SHA256",
        t,
        sign: sign({ t, method: "GET", path, token })
      }
    });

    const result = response.data.result;

    // ✅ Map sensor values (CORRECTED)
    let temperatureC = 0;
    let humidity = 0;
    let battery = 0;

    result.forEach(item => {
      if (item.code === "temp_current") {
        temperatureC = item.value / 10;
      }
      if (item.code === "humidity") {
        humidity = item.value;
      }
      if (item.code === "battery_percentage") {
        battery = item.value;
      }
    });

    // ✅ Save to rawSensorReadings
    const record = await RawSensorReading.create({
      deviceId: DEVICE_ID,
      temperatureC,
      humidity,
      battery
    });

    // ✅ Ensure sensor exists (metadata)
    await Sensor.updateOne(
      { deviceId: DEVICE_ID },
      { deviceId: DEVICE_ID },
      { upsert: true }
    );

    res.json({
      message: "✅ Sensor data fetched and stored",
      record
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ OPTIONAL: GET ALL READINGS
router.get("/readings", async (req, res) => {
  try {
    const readings = await RawSensorReading.find().sort({ createdAt: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET ALL SENSORS (LATEST VALUE ONLY)
router.get("/all-sensors", async (req, res) => {
  try {
    // 1. Get all sensors
    const sensors = await Sensor.find().sort({ createdAt: -1 });

    // 2. For each sensor get latest reading
    const sensorData = await Promise.all(
      sensors.map(async (sensor) => {
        const latest = await RawSensorReading
          .findOne({ deviceId: sensor.deviceId })
          .sort({ createdAt: -1 });

        return {
          _id: sensor._id,
          deviceId: sensor.deviceId,
          metalDescription: sensor.metalDescription,
          materialDescription: sensor.materialDescription,

          // ✅ Latest values (if exists)
          temperature: latest ? latest.temperatureC : null,
          humidity: latest ? latest.humidity : null,
          battery: latest ? latest.battery : null,
          lastUpdated: latest ? latest.createdAt : null
        };
      })
    );

    res.json(sensorData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD SENSOR MANUALLY
router.post("/add-sensor", async (req, res) => {
  try {
    const { deviceId, metalDescription, materialDescription } = req.body;

    // ✅ validation
    if (!deviceId) {
      return res.status(400).json({
        message: "deviceId is required"
      });
    }

    // ✅ check if already exists
    const existing = await Sensor.findOne({ deviceId });

    if (existing) {
      return res.status(400).json({
        message: "Sensor already exists"
      });
    }

    // ✅ create new sensor
    const sensor = await Sensor.create({
      deviceId,
      metalDescription: metalDescription || "",
      materialDescription: materialDescription || ""
    });

    res.status(201).json({
      message: "✅ Sensor added successfully",
      sensor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
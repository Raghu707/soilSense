import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

import RawSensorReading from "../models/RawSensorReading.js";
import Sensor from "../models/Sensor.js";

dotenv.config();

const router = express.Router();

/* ================================
   ✅ ENV CONFIG
================================ */
const CLIENT_ID = process.env.TUYA_CLIENT_ID;
const CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET;
const DEVICE_ID = process.env.DEVICE_ID;
const HOST = process.env.TUYA_BASE_HOST;

/* ================================
   ✅ TUYA SIGNATURE
================================ */
const EMPTY_HASH =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

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

/* ================================
   ✅ GET TUYA TOKEN
================================ */
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

/* ================================
   ✅ CREATE SENSOR
================================ */
router.post("/", async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ GET ALL SENSORS
================================ */
router.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.find().sort({ createdAt: -1 });
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ GET SINGLE SENSOR
================================ */
router.get("/:id", async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    res.json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ UPDATE SENSOR
================================ */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Sensor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ DELETE SENSOR
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Sensor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    res.json({ message: "✅ Sensor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ FETCH REAL SENSOR DATA (TUYA)
================================ */
router.get("/fetch/data", async (req, res) => {
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

    let temperature = null;
    let humidity = null;
    let battery = null;

    result.forEach(item => {
      if (item.code === "temp_current") {
        temperature = item.value / 10;
      }
      if (item.code === "humidity") {
        humidity = item.value;
      }
      if (item.code === "battery_percentage") {
        battery = item.value;
      }
    });

    // ✅ Save reading
    const record = await RawSensorReading.create({
      deviceId: DEVICE_ID,
      temperature,
      humidity,
      battery
    });

    // ✅ Update sensor latest values
    await Sensor.updateOne(
      { deviceId: DEVICE_ID },
      {
        deviceId: DEVICE_ID,
        temperature,
        humidity,
        battery,
        fetchedAt: new Date()
      },
      { upsert: true }
    );

    res.json({
      message: "✅ Data fetched & stored",
      temperature,
      humidity,
      battery,
      record
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ GET ALL RAW READINGS
================================ */
router.get("/readings/all", async (req, res) => {
  try {
    const readings = await RawSensorReading.find()
      .sort({ createdAt: -1 });

    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   ✅ GET READINGS BY DEVICE
================================ */
router.get("/readings/:deviceId", async (req, res) => {
  try {
    const readings = await RawSensorReading.find({
      deviceId: req.params.deviceId
    }).sort({ createdAt: -1 });

    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
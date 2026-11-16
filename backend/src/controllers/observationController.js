import Observation from "../models/Observation.js";


// ✅ CREATE OBSERVATION
export const createObservation = async (req, res) => {
  try {
    const observation = await Observation.create({
      studentId: req.user.id,   // from auth middleware
      sensorReadingId: req.body.sensorReadingId,
      date: req.body.date,
      location: req.body.location,
      weather: req.body.weather,
      wind: req.body.wind,
      notes: req.body.notes
    });

    res.status(201).json({
      message: "✅ Observation created",
      observation
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ GET ALL OBSERVATIONS
export const getObservations = async (req, res) => {
  try {
    const observations = await Observation.find()
      .populate("studentId", "name email")
      .populate({
        path: "sensorReadingId",
        select: "temperatureC humidity battery createdAt"
      })
      .sort({ createdAt: -1 });

    res.json(observations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ GET SINGLE OBSERVATION
export const getObservationById = async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("sensorReadingId");

    if (!observation) {
      return res.status(404).json({ msg: "Observation not found" });
    }

    res.json(observation);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ DELETE OBSERVATION
export const deleteObservation = async (req, res) => {
  try {
    const deleted = await Observation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Observation not found" });
    }

    res.json({ msg: "✅ Observation deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
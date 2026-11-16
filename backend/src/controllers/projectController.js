import Project from "../models/Project.js";
import User from "../models/User.js";
import Sensor from "../models/Sensor.js";
import SensorStudentMap from "../models/SensorUserMap.js";
import Observation from "../models/Observation.js";

import RawSensorReading from "../models/RawSensorReading.js";
/* ================================
   ✅ CREATE PROJECT
================================ */
export const createProject = async (req, res) => {
  try {
    const { name, students, sensors, description, location, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    if (!students?.length) {
      return res.status(400).json({ message: "Select at least one student" });
    }

    if (!sensors?.length) {
      return res.status(400).json({ message: "Select at least one sensor" });
    }

    // ✅ VALIDATE STUDENTS
    const validStudents = await User.find({
      _id: { $in: students },
      role: "student"
    });

    if (validStudents.length !== students.length) {
      return res.status(400).json({ message: "Invalid student(s)" });
    }

    // ✅ VALIDATE SENSORS
    const validSensors = await Sensor.find({
      _id: { $in: sensors }
    });

    if (validSensors.length !== sensors.length) {
      return res.status(400).json({ message: "Invalid sensor(s)" });
    }

    const project = await Project.create({
      name,
      description,
      location,
      startDate,
      endDate,
      students,
      sensors,
      supervisorId: req.user?.id || null,
    });

    res.status(201).json({
      message: "✅ Project created successfully",
      project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ GET ALL PROJECTS
================================ */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("students", "name email")
      .populate("sensors", "deviceId")
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ GET PROJECT BY ID
================================ */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("students", "name email")
      .populate("sensors", "deviceId")
      .populate("supervisorId", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ UPDATE PROJECT
================================ */
export const updateProject = async (req, res) => {
  try {
    const { students, sensors } = req.body;

    // ✅ OPTIONAL VALIDATION
    if (students) {
      const validStudents = await User.find({
        _id: { $in: students },
        role: "student"
      });

      if (validStudents.length !== students.length) {
        return res.status(400).json({ message: "Invalid student(s)" });
      }
    }

    if (sensors) {
      const validSensors = await Sensor.find({
        _id: { $in: sensors }
      });

      if (validSensors.length !== sensors.length) {
        return res.status(400).json({ message: "Invalid sensor(s)" });
      }
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("students", "name email")
      .populate("sensors", "deviceId")
      .populate("supervisorId", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "✅ Project updated",
      project: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================================
   ✅ DELETE PROJECT
================================ */
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Clean mapping
    await SensorStudentMap.deleteMany({
      projectId: req.params.id
    });

    res.json({ message: "✅ Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**************************************
 * GET PROJECT FOR LOGGED IN STUDENT
 **************************************/
export const getMyProject = async (req, res) => {

  try {

    const studentId = req.user.id;

    const project = await Project.findOne({

      students: studentId

    })
    .populate("students", "name email")
    .populate("sensors", "deviceId");

    if (!project) {

      return res.json({

        projectAssigned: false,
        sensorAssigned: false
      });
    }

    return res.json({

      projectAssigned: true,

      sensorAssigned:
        project.sensors &&
        project.sensors.length > 0,

      project
    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      message: error.message
    });
  }

};
/* ================================
   ✅ PROJECT GRAPH DATA
================================ */

/* ================================
   ✅ PROJECT GRAPH DATA
================================ */
export const getProjectGraph = async (req, res) => {
  try {

    const { projectId } = req.params;

    const project = await Project
      .findById(projectId)
      .populate("sensors", "deviceId");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (
      !project.sensors ||
      project.sensors.length === 0
    ) {
      return res.status(400).json({
        message: "No sensor assigned"
      });
    }

    const deviceId =
      project.sensors[0].deviceId;

    const readings =
      await RawSensorReading.find({
        deviceId
      }).sort({
        createdAt: 1
      });

    const labels = [];
    const temperature = [];
    const humidity = [];
    const battery = [];

    readings.forEach(reading => {

      labels.push(
        new Date(
          reading.createdAt
        ).toLocaleString()
      );

      temperature.push(
        reading.temperatureC || 0
      );

      humidity.push(
        reading.humidity || 0
      );

      battery.push(
        reading.battery || 0
      );

    });

    return res.status(200).json({

      projectId: project._id,

      projectName: project.name,

      sensorName: deviceId,

      dataCount: readings.length,

      labels,

      temperature,

      humidity,

      battery

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }
};
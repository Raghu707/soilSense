import Project from "../models/Project.js";
import User from "../models/User.js";
import Sensor from "../models/Sensor.js";
import SensorStudentMap from "../models/SensorUserMap.js";

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
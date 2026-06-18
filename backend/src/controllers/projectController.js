import Project from "../models/Project.js";
import User from "../models/User.js";
import Sensor from "../models/Sensor.js";
import SensorStudentMap from "../models/SensorUserMap.js";

export const createProject = async (req, res) => {
  try {
    const { studentId, sensorId } = req.body;

    // ✅ validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student" });
    }

    // ✅ validate sensor
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(400).json({ message: "Sensor not found" });
    }

    // ✅ check if sensor already assigned
    const existing = await SensorStudentMap.findOne({
      sensorId
    });

    if (existing) {
      return res.status(400).json({
        message: "Sensor already paired with a student"
      });
    }

    // ✅ CREATE PROJECT
    const project = await Project.create({
      ...req.body,
      supervisorId: req.user.id
    });

    // ✅ CREATE MAPPING 🔥
    const mapping = await SensorStudentMap.create({
      projectId: project._id,
      studentId,
      sensorId
    });

    res.status(201).json({
      message: "✅ Project + Mapping created successfully",
      project,
      mapping
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





/* ================================
   ✅ GET ALL PROJECTS (SORTED)
================================ */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 }); // ✅ newest first

    const cleanProjects = projects.map(p => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      location: p.location,
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.status,
      supervisor: {
        _id: p.supervisorId?._id,
        name: p.supervisorId?.name,
        email: p.supervisorId?.email
      }
    }));

    res.json(cleanProjects);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ GET SINGLE PROJECT
================================ */
export const getProjectById = async (req, res) => {
  try {
   const projects = await Project.find()
  .populate("supervisorId", "name email")
  .populate("studentId", "name email")   // ✅ NEW
  .populate("sensorId")                  // ✅ NEW
  .sort({ createdAt: -1 });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      supervisor: {
        _id: project.supervisorId?._id,
        name: project.supervisorId?.name,
        email: project.supervisorId?.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ================================
   ✅ UPDATE PROJECT
================================ */
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({
      _id: updated._id,
      name: updated.name,
      description: updated.description,
      location: updated.location,
      startDate: updated.startDate,
      endDate: updated.endDate,
      status: updated.status
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
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ msg: "✅ Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

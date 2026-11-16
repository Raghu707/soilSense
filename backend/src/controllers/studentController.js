import User from "../models/User.js";
import Project from "../models/Project.js";
import Sensor from "../models/Sensor.js";

import Observation from "../models/Observation.js";
/* ================================
   ✅ STUDENT PROJECT
================================ */
export const getStudentProject = async (req, res) => {
  try {

    const studentId = req.user.id;

    const project = await Project.findOne({
      students: studentId
    })
      .populate("students")
      .populate("sensors");

    if (!project) {
      return res.json({
        projectAssigned: false,
        sensorAssigned: false
      });
    }

    return res.json({
      projectAssigned: true,
      sensorAssigned: project.sensors.length > 0,
      project
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: "Failed to load project"
    });

  }
};


/* ================================
   ✅ STUDENT PROFILE
================================ */
export const getStudentProfile = async (req, res) => {
  try {

    const studentId = req.user.id;

    // Logged-in student
    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        msg: "Student not found"
      });
    }

    // Find student's project
    const project = await Project.findOne({
      students: studentId
    });

    let projectName = "Not Assigned";
    let sensorName = "Not Assigned";
    let supervisorName = "Not Assigned";

    if (project) {

      projectName = project.name || "Not Assigned";

      // Supervisor
      if (project.supervisorId) {

        const supervisor = await User.findById(
          project.supervisorId
        );

        if (supervisor) {
          supervisorName = supervisor.name;
        }
      }

      // Sensor
      if (
        project.sensors &&
        project.sensors.length > 0
      ) {

        const sensor = await Sensor.findById(
          project.sensors[0]
        );

        if (sensor) {
          sensorName = sensor.deviceId;
        }
      }
    }

    return res.status(200).json({
      username: user.name,
      email: user.email,
      project: projectName,
      sensor: sensorName,
      supervisor: supervisorName
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }
};
/* ================================
   ✅ UPDATE STUDENT PROFILE
================================ */
export const updateStudentProfile = async (req, res) => {
  try {

    const studentId = req.user.id;

    const { name, email } = req.body;

    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        msg: "Student not found"
      });
    }

    if (email && email !== user.email) {

      const existingUser = await User.findOne({
        email
      });

      if (existingUser) {
        return res.status(400).json({
          msg: "Email already exists"
        });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "✅ Profile updated successfully",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};
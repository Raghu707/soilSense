import User from "../models/User.js";
import Project from "../models/Project.js";
import Sensor from "../models/Sensor.js";
import Observation from "../models/Observation.js";

/* ================================
   ✅ STUDENT PROFILE
================================ */
export const getStudentProfile = async (req, res) => {
  try {

    const studentId = req.user.id;

    // Student Details
    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        msg: "Student not found"
      });
    }

    let projectName = "Not Assigned";
    let sensorName = "Not Assigned";
    let supervisorName = "Not Assigned";

    // Find student's assigned project
    const project = await Project.findOne({
      students: studentId
    });

    if (project) {

      projectName = project.name || "Not Assigned";

      // Supervisor Lookup
      if (project.supervisorId) {

        const supervisor = await User.findById(
          project.supervisorId
        );

        if (supervisor) {
          supervisorName = supervisor.name;
        }
      }

      // Sensor Lookup
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

    // Observation Count
    const observationCount =
      await Observation.countDocuments({
        studentId
      });

    return res.status(200).json({

      username: user.name,

      email: user.email,

      project: projectName,

      sensor: sensorName,

      supervisor: supervisorName,

      observation:
        observationCount > 0
          ? "Assigned"
          : "Not Assigned",

      observationCount

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }
};
import Project from "../models/Project.js";

/* ================================
   ✅ CREATE PROJECT
================================ */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      supervisorId: req.user.id,
      status: req.body.status || "active"
    });

    res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status
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
    const project = await Project.findById(req.params.id)
      .populate("supervisorId", "name email");

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

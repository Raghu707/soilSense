import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// DB
import { connectDB } from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sensorRoutes from "./routes/sensor.js";   // ✅ fix filename
import observationRoutes from "./routes/observationRoutes.js";

// Load env variables
dotenv.config();

// Create app
const app = express();

// ✅ Middleware (ONLY ONCE)
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ SoilSense API Running");
});

// ✅ Connect DB first
await connectDB();

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/observations", observationRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

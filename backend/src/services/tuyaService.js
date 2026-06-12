import RawSensorReading from "../models/RawSensorReading.js";

export const saveReadingToDB = async (data) => {
  try {
    const record = new RawSensorReading(data);
    await record.save();

    console.log("✅ Saved to DB:", record);
    return record;

  } catch (error) {
    console.error("❌ DB Error:", error);
  }
};
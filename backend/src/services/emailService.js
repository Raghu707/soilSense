import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ IMPORTANT: export properly
export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"SoilSense" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.log("❌ Email error:", error.message);
  }
};
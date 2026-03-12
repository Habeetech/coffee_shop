import "dotenv/config";
import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `http://localhost:3000/api/auth/reset-password/${token}`;
//  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: `"Coffee Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err;
  }
}

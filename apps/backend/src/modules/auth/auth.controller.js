import * as authService from "./auth.service.js"
import { sendPasswordResetEmail } from "../../utils/email.js";
import AppError from "../../utils/AppError.js";

export async function loginRequest(req, res) {
  const { token, refreshToken, user } = await authService.loginRequest(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh"
  });
  res.status(200).json({
    message: "Login successful",
    token,
    user
  });
}

export async function registerRequest(req, res) {
  const user = await authService.registerAccount(req.body);
  res.status(201).json({ message: "Account Created Sucessfully", user })
}
export async function forgotPassword(req, res) {
  const result = await authService.forgotPassword(req.body.emailOrPhone);

  if (result) {
    await sendPasswordResetEmail(result.user.email, result.rawToken);
  }
  res.status(200).json({
    message: "If an account exists, a reset link has been sent."
  });
}
export async function resetPassword(req, res) {
  await authService.resetPassword(req.params.token, req.body.password);

  res.status(200).json({ message: "Password reset successful" });
}
export async function logoutRequest(req, res) {
  await authService.logoutRequest(req.cookies.refreshToken);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/api/auth/refresh"
  });
  res.status(200).json({ message: "Logged out successfully" });
}
export async function refreshAccessToken(req, res) {
  if (!req.cookies.refreshToken) throw new AppError("No refresh token provided", 401)
  const { token, refreshToken } = await authService.refreshAccessToken(req.cookies.refreshToken);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh"
  })
  res.status(200).json({ token });
}
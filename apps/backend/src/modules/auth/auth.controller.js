import * as authService from "./auth.service.js"
import { sendPasswordResetEmail } from "../../utils/email.js";

export async function loginRequest(req, res) {
    const {token, user} = await authService.loginRequest(req.body);
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

  if (result){
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

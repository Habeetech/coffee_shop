import * as authService from "./auth.service.js"
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
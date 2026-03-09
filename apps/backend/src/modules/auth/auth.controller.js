import * as authService from "./auth.service.js"
export async function loginRequest (req, res) {
    const tokenObject = await authService.loginRequest(req.body);
    res.status(200).json({
        message: "Login Successful",
        token: tokenObject.token
    });
} 

export async function registerRequest (req, res) {
    const user = await authService.registerAccount(req.body);
    res.status(201).json({message: "Account Created Sucessfully"})
}
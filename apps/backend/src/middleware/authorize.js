import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export default function authorize(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError("Unathorized: Missing authorization header", 401);
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError("Unathorized: Invalid token format", 401);
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
        req.user = decoded;
        next()
    } catch (e) {
        throw new AppError(`Unathorized ${e.message}`, 401)
    }
}
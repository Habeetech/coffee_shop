import AppError from "../utils/AppError.js"

export default function allowRoles(...roles) {
    return function (req, res, next) {
        if(!roles.includes(req.user.role)) {
            throw new AppError("Access Denied: You do not have right access for this route, contact the admin", 403);
        }
        next()
    }
}
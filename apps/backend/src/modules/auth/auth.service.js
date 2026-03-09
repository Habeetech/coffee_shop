import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const registerAccount = async (userRequest) =>
{
    const { username, email, password: plainPassword } = userRequest;
    const existingUserName = await User.findOne({ username });
    const existingEmail = await User.findOne({ email})
    if(existingUserName) {
        throw new AppError("Username already exist. Please choose a different username", 409);
    }
    else if (existingEmail) {
        throw new AppError("Email already exist. Please choose a different email", 409);
    } 
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
   
    const {password, confirmPassword, ...rest} = userRequest;
    const newUser = {
        passwordHash: hashedPassword, ...rest
    }
   return await User.create(newUser)
}
export const loginRequest = async (userRequest) => {
    const {usernameOrEmail, password } = userRequest;
    const user = await User.findOne({$or: [{username: usernameOrEmail}, {email: usernameOrEmail}]});
    if (!user) {
        throw new AppError("Could not find a user with the username or email", 400);
    }
    
    const correctPassword = await bcrypt.compare(password, user.passwordHash);
    if (!correctPassword) {
        throw new AppError("You have entered an invalid password", 400)
    }
    const secret = process.env.JWT_SECRET;
    const payload = {
        userId: user._id.toString(),
        username: user.username,
        role: user.role
    }
    const options = {
        expiresIn: "1h"
    }
    const jwtToken = jwt.sign(payload, secret, options)
    return {token: jwtToken};
}
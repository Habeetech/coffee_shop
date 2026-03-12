import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const registerAccount = async (userRequest) => {
    const { username, email, password: plainPassword, phone } = userRequest;
    const existingUser = await User.findOne({
        $or: [{ username }, { email }, { phone }]
    });

    if (existingUser) {
        if (username && existingUser.username === username) {
            throw new AppError("Username already exist. Please choose a different username", 409);
        }
        if (email && existingUser.email === email) {
            throw new AppError("Email already exist. Please choose a different email", 409);
        }
        if (phone && existingUser.phone === phone) {
            throw new AppError("Phone number already exist. Please choose a different phone number", 409);
        }
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const { password, confirmPassword, ...rest } = userRequest;
    const newUser = await User.create({
        passwordHash: hashedPassword,
        ...rest
    });

    const { passwordHash, ...safeUser } = newUser.toObject();

    return safeUser;

}
export const loginRequest = async (userRequest) => {
    const { usernameOrEmail, password } = userRequest;
    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) {
        throw new AppError("Could not find a user with the username or email", 400);
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);
    if (!correctPassword) {
        throw new AppError("You have entered an invalid password", 400)
    }
    const token = jwt.sign(
        {
            userId: user._id.toString(),
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const { passwordHash, ...safeUser } = user.toObject();

    return { token, user: safeUser };

}
export async function forgotPassword(emailOrPhone) {
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
  });

  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 10;
  await user.save();

  return {rawToken, user};
}
export async function resetPassword(token, newPassword) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
}

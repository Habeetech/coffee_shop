import AppError from "../../utils/AppError.js";
import User from "../users/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "./auth.token.model.js";

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
    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] })
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
        { expiresIn: "30m" }
    );
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const { passwordHash, ...safeUser } = user.toObject();
    await RefreshToken.create({ userId: user._id, token: hashedToken, expiresAt: expiryDate });
    return { token, refreshToken, user: safeUser };

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
    const { passwordHash, ...safeUser } = user.toObject();

    return { rawToken, user: safeUser };
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
    const { passwordHash, ...safeUser } = user.toObject();

    return safeUser;
}
export async function logoutRequest(refreshToken) {
    if (refreshToken) {
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await RefreshToken.deleteOne({ token: hashedToken });
    }
}
export async function refreshAccessToken(refreshToken) {
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const user = await RefreshToken.findOne({ token: hashedToken })
        .populate("userId");
    if (!user) throw new AppError("No user found with the refreshToken", 404);
    const { userId: userData } = user;
    const token = jwt.sign(
        {
            userId: userData._id.toString(),
            username: userData.username,
            role: userData.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    );
    const newRefreshToken = crypto.randomBytes(32).toString("hex");
    const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({ userId: user._id, token: newHashedToken, expiresAt: expiryDate });
    await RefreshToken.deleteOne({ token: hashedToken })
    return ({ token, newRefreshToken });
}

export async function changePassword(id, password, newPassword) {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(`No user found for Id - ${id}`, 404);
    }
    console.log("Incoming password:", password);
console.log("Incoming newPassword:", newPassword);
console.log("Stored hash BEFORE:", user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new AppError("You have entered an invalid password", 400);
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashNewPassword;
    await user.save();
    const { passwordHash, ...safeUser } = user.toObject();
console.log("Stored hash AFTER:", user.passwordHash);

    return safeUser;
}
export async function confirmPassword(id, password) {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(`No user found for Id - ${id}`, 404);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new AppError("You have entered an invalid password", 400);
    }

    const { passwordHash, ...safeUser } = user.toObject();
    return safeUser;
}

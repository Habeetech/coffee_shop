import AppError from "../../utils/AppError.js";
import User from "./user.model.js";
import bcrypt from "bcrypt"

export function sanitizeUser(user) {
    const obj = user.toObject();
    const { passwordHash, ...safe } = obj;
    return safe;
}

export async function getUsers() {
    const users = await User.find();
    return users.map(user => sanitizeUser(user))
}
export async function getAUser(id) {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(`No user found for Id ${id}`, 404)
    }
    return sanitizeUser(user);
}
export async function getMyProfile(id) {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError("Error: Profile not found", 404)
    }
    return sanitizeUser(user);
}
export async function updateMyProfile(id, data) {
  if (data.address) {
    const existing = await User.findById(id).lean();

    const existingAddress = existing?.address || {};

    data.address = {
      ...existingAddress,
      ...data.address
    };
  }

  const userUpdate = await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
    context: "query"
  });

  if (!userUpdate) {
    throw new AppError("Error: Profile not found", 404);
  }

  return sanitizeUser(userUpdate);
}

export async function deleteAUser(id) {
    const userToDelete = await User.findByIdAndDelete(id)
    if (!userToDelete) {
        throw new AppError(`No user found for Id ${id}`, 404)
    }
    return sanitizeUser(userToDelete);
}
export async function deleteMyProfile(id) {
    const userToDelete = await User.findByIdAndDelete(id)
    if (!userToDelete) {
        throw new AppError("Error: Profile not found", 404)
    }
    return sanitizeUser(userToDelete);
}
export async function changePassword(id, password) {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError("Error: Profile not found", 404)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userUpdate = await User.findByIdAndUpdate(user._id, { passwordHash: hashedPassword }, {
        returnDocument: "after",
        runValidators: true
    })
    return sanitizeUser(userUpdate);
}
export async function changeUserRole(id, body) {
    const user = await User.findByIdAndUpdate(id, { role: body.role }, {
        returnDocument: "after",
        runValidators: true
    })
    if (!user) {
        throw new AppError(`No user found for Id ${id}`, 404)
    }
    return sanitizeUser(user)
}

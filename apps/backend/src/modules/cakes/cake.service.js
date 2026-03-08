import Cake from "./cake.model.js";
import AppError from "../../utils/AppError.js";

export const getCakes = async () => await Cake.find();

export const getACake = async (id) => {
    const requestedCake = await Cake.findById(id);
    if (!requestedCake) {
        throw new AppError(`The cake with id: ${id} cannot be found`, 404)
    }
    return requestedCake;
}

export const addCake = async (data) => {
    const { name } = data;

    if (!name) {
        throw new AppError("Cake name is required", 400);
    }
    const existing = await Cake.findOne({ name })
    if (existing) {
        throw new AppError("Cake name already exists", 409);
    }
    return await Cake.create(data)
}

export const updateCake = async (id, data) => {
    const cakeToUpdate = await Cake.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true
    })
    if (!cakeToUpdate) {
        throw new AppError(`The cake with id: ${id} cannot be found`, 404)
    }
    return cakeToUpdate;
}

export const deleteCake = async (id) => {
    const cakeToDelete = Cake.findByIdAndDelete(id)
    if (!cakeToDelete)
    {
         throw new AppError(`The cake with id: ${id} cannot be found`, 404)
    }
    return cakeToDelete;
}
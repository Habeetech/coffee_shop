import Buscuit from "./buscuit.model.js";
import AppError from "../../utils/AppError.js";

export const getBuscuits = async () => await Buscuit.find();

export const getABuscuit = async (id) => {
    const requestedBuscuit = await Buscuit.findById(id);
    if (!requestedBuscuit) {
        throw new AppError(`The buscuit with id: ${id} cannot be found`, 404)
    }
    return requestedBuscuit;
}

export const addBuscuit = async (data) => {
    const { name } = data;

    if (!name) {
        throw new AppError("Buscuit name is required", 400);
    }
    const existing = await Buscuit.findOne({ name })
    if (existing) {
        throw new AppError("Buscuit name already exists", 409);
    }
    return await Buscuit.create(data)
}

export const updateBuscuit = async (id, data) => {
    const buscuitToUpdate = await Buscuit.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true
    })
    if (!buscuitToUpdate) {
        throw new AppError(`The buscuit with id: ${id} cannot be found`, 404)
    }
    return buscuitToUpdate;
}

export const deleteBuscuit = async (id) => {
    const buscuitToDelete = Buscuit.findByIdAndDelete(id)
    if (!buscuitToDelete)
    {
         throw new AppError(`The buscuit with id: ${id} cannot be found`, 404)
    }
    return buscuitToDelete;
}
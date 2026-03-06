import Food from "./food.model.js";
import AppError from "../../utils/AppError.js";

export const getFoods = async () => await Food.find();

export const getAFood = async (id) => {
    const requestedFood = await Food.findById(id);
    if (!requestedFood) {
        throw new AppError(`The food with id: ${id} cannot be found`, 404)
    }
    return requestedFood;
}

export const addFood = async (data) => {
    const { name } = data;

    if (!name) {
        throw new AppError("Food name is required", 400);
    }
    const existing = await Food.findOne({ name })
    if (existing) {
        throw new AppError("Food name already exists", 409);
    }
    return await Food.create(data)
}

export const updateFood = async (id, data) => {
    const updatedFood = await Food.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true
    })
    if (!updatedFood) {
        throw new AppError(`The food with id: ${id} cannot be found`, 404)
    }
    return updatedFood;
}

export const deleteFood = async (id) => {
    const foodToDelete = Food.findByIdAndDelete(id)
    if (!foodToDelete)
    {
         throw new AppError(`The food with id: ${id} cannot be found`, 404)
    }
    return foodToDelete;
}
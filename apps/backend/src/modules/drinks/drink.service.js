import AppError from "../../utils/AppError.js"
import Drink from "./drink.model.js"
//import resetDrinks from "../../utils/resetDrinks.js"
//resetDrinks();
export const getDrinks = async () => {
    return await Drink.find();
}
export const getADrink = async (id) => {

    const requestedDrink = await Drink.findById(id)
    if (!requestedDrink) {
        throw new AppError(`The drink with id: ${id} cannot be found`, 404)
    }
    return requestedDrink;
}
export const addDrink = async (data) => {
    const { name, price, size } = data;

    if (!name) {
        throw new AppError("Drink name is required", 400);
    }

    const existing = await Drink.findOne({ name });
    if (existing) {
        throw new AppError("Drink name already exists", 409);
    }

    return await Drink.create(data);
};
export const updateDrink = async (id, data) => {
    const updatedDrink = await Drink.findByIdAndUpdate(id, data, { 
        returnDocument: "after",
        runValidators: true
     })
    if (!updatedDrink) {
        throw new AppError(`The drink with id: ${id} cannot be found`, 404)
    }
    return updatedDrink;
}
export const deleteDrink = async (id) => {
    const deletedDrink = await Drink.findByIdAndDelete(id)
    if (!deletedDrink) {
        throw new AppError(`The drink with id: ${id} cannot be found`, 404)
    }
    return deletedDrink;
}
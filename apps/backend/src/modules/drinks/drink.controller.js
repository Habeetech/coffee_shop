import AppError from "../../utils/AppError.js";
import * as drinkService from "./drink.service.js";

export async function getDrinks(req, res, next) {
        const drinks = await drinkService.getDrinks();
        res.status(200).json(drinks)
}
export async function getADrink(req, res, next) {
        const drink = await drinkService.getADrink(req.params.id);
        res.json(drink)

}
export async function addDrink(req, res, next) {
    const { name, price } = req.body
        if (!name || name.trim() === "")
        {
            throw new AppError("Drink name can not be empthy", 400);
        }
        if ( typeof price !== "number" || price <= 0)
        {
            throw new AppError("Price must be a number greater than zero", 400);
        }
        const drink = await drinkService.addDrink(req.body);
        res.status(201).json(drink);
}
export async function updateDrink(req, res, next) {
    const { name, price } = req.body;
        if (name !== undefined && (!name || name.trim() == ""))
        {
            throw new AppError("Drink name can not be empthy", 400);
        }
        if (price !== undefined && (typeof price !== "number" || price <= 0))
        {
            throw new AppError("Price must be a number greater than zero", 400);   
        }
        const updatedDrink = await drinkService.updateDrink(req.params.id, req.body)
        res.json(updatedDrink)
}
export async function deleteDrink(req, res, next) {
  
           const deletedDrink = await drinkService.deleteDrink(req.params.id)
           res.sendStatus(204)
}
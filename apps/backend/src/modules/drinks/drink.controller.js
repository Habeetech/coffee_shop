import * as drinkService from "./drink.service.js";

export async function getDrinks(req, res, next) {
    try {
        const drinks = await drinkService.getDrinks();
        res.status(200).json(drinks)
    } catch (error) {
        next(error)
    }
}
export async function getADrink(req, res, next) {
    try {
        const drink = await drinkService.getADrink(req.params.id);
        res.json(drink)
    } catch (error) {
        next(error)
    }

}
export async function addDrink(req, res, next) {
    try {
        const drink = await drinkService.addDrink(req.body);
        res.status(201).json(drink);

    } catch (error) {
        next(error)
    }
}
export async function updateDrink(req, res, next) {
    try {
        const updatedDrink = await drinkService.updateDrink(req.params.id, req.body)
        res.json(updatedDrink)
    } catch (error) {
        next(error)
    }
}
export async function deleteDrink(req, res, next) {
    try {
           const deletedDrink = await drinkService.deleteDrink(req.params.id)
           res.sendStatus(204)
    } catch (error) {
        next(error)
    }
 
}
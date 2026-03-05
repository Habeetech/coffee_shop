import * as drinkService from "./drink.service.js";
// You likely don't even need AppError here if Zod is doing its job!

export async function getDrinks(req, res) {
    const drinks = await drinkService.getDrinks();
    res.status(200).json(drinks);
}

export async function getADrink(req, res) {
    const drink = await drinkService.getADrink(req.params.id);
    res.json(drink);
}

export async function addDrink(req, res) {
    // Remove manual 'if' checks; let Zod middleware (validate.js) handle them.
    const drink = await drinkService.addDrink(req.body);
    res.status(201).json(drink);
}

export async function updateDrink(req, res) {
    // Let Zod .partial() handle the validation of incoming updates.
    const updatedDrink = await drinkService.updateDrink(req.params.id, req.body);
    res.json(updatedDrink);
}

export async function deleteDrink(req, res) {
    await drinkService.deleteDrink(req.params.id);
    res.sendStatus(204);
}
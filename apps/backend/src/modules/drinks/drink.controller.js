import * as drinkService from "./drink.service.js";


export async function getDrinks(req, res) {
    const drinks = await drinkService.getDrinks();
    res.status(200).json(drinks);
}

export async function getADrink(req, res) {
    const drink = await drinkService.getADrink(req.params.id);
    res.status(200).json(drink);
}

export async function addDrink(req, res) {
    const drink = await drinkService.addDrink(req.body);
    res.status(201).json(drink);
}

export async function updateDrink(req, res) {
    const updatedDrink = await drinkService.updateDrink(req.params.id, req.body);
    res.json(updatedDrink);
}

export async function deleteDrink(req, res) {
    await drinkService.deleteDrink(req.params.id);
    res.sendStatus(204);
}
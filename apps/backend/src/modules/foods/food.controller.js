import * as foodService from "./food.service.js"

export async function getFoods (req, res) {
    const foods = await foodService.getFoods();
    res.status(200).json(foods);
}

export async function getAFood (req, res) {
    const food = await foodService.getAFood(req.params.id);
    res.status(200).json(food);
}

export async function addFood (req, res) {
    const food = await foodService.addFood(req.body);
    res.status(201).json(food);
}

export async function updateFood (req, res) {
    const updatedFood = await foodService.updateFood(req.params.id, req.body);
    res.json(updatedFood);
}

export async function deleteFood (req, res) {
    await foodService.deleteFood(req.params.id);
    res.sendStatus(204);
}
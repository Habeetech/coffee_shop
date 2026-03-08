import * as cakeService from "./cake.service.js"

export async function getCakes (req, res) {
    const cakes = await cakeService.getCakes();
    res.status(200).json(cakes);
}

export async function getACake (req, res) {
    const cake = await cakeService.getACake(req.params.id);
    res.status(200).json(cake);
}

export async function addCake (req, res) {
    const cake = await cakeService.addCake(req.body);
    res.status(201).json(cake);
}

export async function updateCake (req, res) {
    const updatedCake = await cakeService.updateCake(req.params.id, req.body);
    res.json(updatedCake);
}

export async function deleteCake (req, res) {
    await cakeService.deleteCake(req.params.id);
    res.sendStatus(204);
}
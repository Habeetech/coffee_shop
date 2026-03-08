import * as buscuitService from "./buscuit.service.js";

export async function getBuscuits(req, res) {
    const buscuits = await buscuitService.getBuscuits();
    res.status(200).json(buscuits);
}

export async function getABuscuit(req, res) {
    const buscuit = await buscuitService.getABuscuit(req.params.id);
    res.status(200).json(buscuit);
}

export async function addBuscuit(req, res) {
    const buscuit = await buscuitService.addBuscuit(req.body);
    res.status(201).json(buscuit);
}

export async function updateBuscuit(req, res) {
    const updatedBuscuit = await buscuitService.updateBuscuit(req.params.id, req.body);
    res.json(updatedBuscuit);
}

export async function deleteBuscuit(req, res) {
    await buscuitService.deleteBuscuit(req.params.id);
    res.sendStatus(204);
}
import * as drinkOptionsService from "./drinkOptions.service.js";

export async function addOptions(req, res) {
    const options = await drinkOptionsService.addOptions(req.body);
    res.status(201).json(options);
}

export async function getOptions(req, res) {
    const options = await drinkOptionsService.getOptions();
    res.status(200).json(options);    
}

export async function updateOptions(req, res) {
    const options = await drinkOptionsService.updateOptions(req.body);
    res.status(200).json(options);
}

export async function deleteOptions(req, res) {
    await drinkOptionsService.deleteOptions(req.params.groupName);
    res.sendStatus(204);
}
export async function deleteOptionItem(req, res) {
    await drinkOptionsService.deletegroupItem(req.params.groupName, req.params.itemId);
    res.sendStatus(204);
}
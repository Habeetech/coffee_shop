import * as crispService from "./crisp.service.js";

export async function getCrisps(req, res) {
  const crisps = await crispService.getCrisps();
  res.status(200).json(crisps);
}

export async function getACrisp(req, res) {
  const crisp = await crispService.getACrisp(req.params.id);
  res.status(200).json(crisp);
}

export async function addCrisp(req, res) {
  const crisp = await crispService.addCrisp(req.body);
  res.status(201).json(crisp);
}

export async function updateCrisp(req, res) {
  const updated = await crispService.updateCrisp(req.params.id, req.body);
  res.json(updated);
}

export async function deleteCrisp(req, res) {
  await crispService.deleteCrisp(req.params.id);
  res.sendStatus(204);
}
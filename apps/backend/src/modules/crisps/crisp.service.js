import Crisp from "./crisp.model.js";
import AppError from "../../utils/AppError.js";

export const getCrisps = async () => await Crisp.find();

export const getACrisp = async (id) => {
  const crisp = await Crisp.findById(id);
  if (!crisp) {
    throw new AppError(`The crisp with id: ${id} cannot be found`, 404);
  }
  return crisp;
};

export const addCrisp = async (data) => {
  const { name } = data;
  if (!name) {
    throw new AppError("Crisp name is required", 400);
  }
  const existing = await Crisp.findOne({ name });
  if (existing) {
    throw new AppError("Crisp name already exists", 409);
  }
  return await Crisp.create(data);
};

export const updateCrisp = async (id, data) => {
  const updated = await Crisp.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true
  });
  if (!updated) {
    throw new AppError(`The crisp with id: ${id} cannot be found`, 404);
  }
  return updated;
};

export const deleteCrisp = async (id) => {
  const deleted = await Crisp.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(`The crisp with id: ${id} cannot be found`, 404);
  }
  return deleted;
};
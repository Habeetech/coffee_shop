import AppError from "../../utils/AppError.js"
import Product from "./product.model.js"

export const getProducts = async (query) => {
        return await Product.find(query)
}
export const getAProduct = async (id) => {

    const product = await Product.findById(id)
    if (!product) {
        throw new AppError(`The product with id: ${id} cannot be found`, 404)
    }
    return product;
}
export const addProduct = async (data) => {
    const { name } = data;

    if (!name) {
        throw new AppError("Product name is required", 400);
    }

    const existing = await Product.findOne({ name });
    if (existing) {
        throw new AppError("Product name already exists", 409);
    }

    return await Product.create(data);
};
export const updateProduct = async (id, data) => {
    const productToUpdate = await Product.findByIdAndUpdate(id, data, { 
        returnDocument: "after",
        runValidators: true,
        context: "query"
     })
    if (!productToUpdate) {
        throw new AppError(`The product with id: ${id} cannot be found`, 404)
    }
    return productToUpdate;
}
export const deleteProduct = async (id) => {
    const productToDelete = await Product.findByIdAndDelete(id)
    if (!productToDelete) {
        throw new AppError(`The product with id: ${id} cannot be found`, 404)
    }
    return productToDelete;
}
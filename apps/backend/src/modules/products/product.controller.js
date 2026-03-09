import * as productService from "../products/product.service.js"


export async function getProducts(req, res) {
    const products = await productService.getProducts(req.query);
    res.status(200).json(products);
}
export async function getAProduct(req, res) {
    const product = await productService.getAProduct(req.params.id);
    res.status(200).json(product);
}

export async function addproduct(req, res) {
    const product = await productService.addProduct(req.body);
    res.status(201).json(product);
}

export async function updateProduct(req, res) {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
}

export async function deleteProduct(req, res) {
    await productService.deleteProduct(req.params.id);
    res.sendStatus(204);
}
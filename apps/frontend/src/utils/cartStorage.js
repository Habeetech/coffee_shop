export const loadCart = (key) =>
{
    const carts = localStorage.getItem(key);
    return JSON.parse(carts);
}
export const saveCart = (carts, key) => {
    const cartsToJson = JSON.stringify(carts);
    localStorage.setItem(key, cartsToJson);
    return;
}
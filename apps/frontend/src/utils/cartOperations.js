
export const addItem = (cartItem, quantity = 1, maxStocks = undefined, carts) => {
    const key = cartItem.productId + JSON.stringify(cartItem.options);
    const newCartItem = {...cartItem, identityKey: key}
    const existing = carts.find(item => item.identityKey === newCartItem.identityKey)
   let newCart = []
   let newQuantity = 0;
    if (existing) {
        newQuantity = existing.quantity + quantity;
        if (maxStocks) {
            if (newQuantity > maxStocks) {
                throw new Error("We don't have enough item in stock, Please reduce the quantity");
            }
        }
        const updatedCartItem = { ...newCartItem, quantity: newQuantity}
        newCart = carts.map(item => item.identityKey === updatedCartItem.identityKey? updatedCartItem : item)
    }
    else {
        newQuantity = quantity;
          if (maxStocks) {
            if (newQuantity > maxStocks) {
                throw new Error("We don't have enough item in stock, Please reduce the quantity");
            } 
        }
        newCart = carts.concat({...newCartItem, quantity: newQuantity});
    }
    return newCart;
}

export const removeItem = (cartItem, carts) => {
    return carts.filter(item => cartItem.identityKey != item.identityKey);
}

export const clearCart = () => {
    return [];
}
export const updateQuantity = (cartItem, quantity, maxStocks = undefined, carts) => {
    const newQuantity = cartItem.quantity + quantity;

    if (maxStocks) {
        if (newQuantity > maxStocks) {
            throw new Error("We don't have enough item in stock, Please reduce the quantity");
        }
    }
    const newCartItem = {...cartItem, quantity: newQuantity}
    return carts.map(item => item.identityKey === newCartItem.identityKey? newCartItem : item);
}
export const calculateTotals = (carts) => {
    return carts.reduce((acc, item) => acc += item.price * item.quantity, 0)
}
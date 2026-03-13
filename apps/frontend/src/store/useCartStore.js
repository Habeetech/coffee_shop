import * as cartOperations from "../utils/cartOperations.js"
import * as cartStorage from "../utils/cartStorage.js";
import { create } from "zustand";


const cart_key = "cart"
const useCartStore = create((set, get) => ({

    carts: cartStorage.loadCart(cart_key) || [],

    addItem: (cartItem, quantity = 1, maxStocks) => {
        const current = get().carts;
        const updated = cartOperations.addItem(cartItem, quantity, maxStocks, current);
        set({ carts: updated });
        cartStorage.saveCart(updated, cart_key)
    },

    removeItem: (cartItem) => {
        const current = get().carts;
        const updated = cartOperations.removeItem(cartItem, current);
        set({ carts: updated });
        cartStorage.saveCart(updated, cart_key);
    },

    updateQuantity: (cartItem, quantity, maxStocks) => {
        const current = get().carts;
        const updated = cartOperations.updateQuantity(cartItem, quantity, maxStocks, current);
        set({ carts: updated });
        cartStorage.saveCart(updated, cart_key);
    },
    clearCart: () => {
        set({ carts: [] });
        cartStorage.saveCart([], cart_key);
    },

    total: () => {
        const current = get().carts;
        return cartOperations.calculateTotals(current);
    }
}));
export default useCartStore;
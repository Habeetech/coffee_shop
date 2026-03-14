import * as cartOperations from "../utils/cartOperations.js"
import * as cartStorage from "../utils/cartStorage.js";
import { create } from "zustand";



const cart_key = "cart";

const useCartStore = create((set, get) => ({
    isCartOpen: false,

    cartIconRef: null,
    setCartIconRef: (ref) => set({ cartIconRef: ref }),

    carts: cartStorage.loadCart(cart_key) || [],

    openCart: () => set({ isCartOpen: true }),

    closeCart: () => set({ isCartOpen: false }),

    toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

    addItem: (cartItem, quantity = 1, maxStocks) => {
        const current = get().carts;
        const updated = cartOperations.addItem(cartItem, quantity, maxStocks, current);
        set({ carts: updated });
        cartStorage.saveCart(updated, cart_key)
    },

    increment: (cartItem, maxStocks) => {
        const current = get().carts
        const updated = cartOperations.increment(cartItem, maxStocks, current);
        set({ carts: updated });
        cartStorage.saveCart(updated, cart_key)
    },
    decrement: (cartItem, maxStocks) => {
        const current = get().carts
        const updated = cartOperations.decrement(cartItem, maxStocks, current);
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
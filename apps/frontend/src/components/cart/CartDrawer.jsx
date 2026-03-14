import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../../store/useCartStore.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import CartPanel from "./CartPanel.jsx";
import "./CartDrawer.css"

export default function CartDrawer() {
  const isCartOpen = useCartStore(state => state.isCartOpen);
  const closeCart = useCartStore(state => state.closeCart);
  const cartIconRef = useCartStore(state => state.cartIconRef);
  const drawerRef = useRef(null);

  useFocusTrap(isCartOpen, drawerRef, () => {
    closeCart();
    cartIconRef?.current?.focus();
  });

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";

  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div className="drawer-overlay"
            initial={{ "--bg-opacity": "0%" }}
            animate={{ "--bg-opacity": "60%" }}
            exit={{ "--bg-opacity": "0%" }}
            onClick={closeCart}
            aria-hidden="true"
          >
            <button
              className="cart-close"
              onClick={(e) => {
                e.stopPropagation()
                closeCart();
                cartIconRef?.current?.focus();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </motion.div>
          <motion.div
            className="drawer-panel"
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <CartPanel />
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
}
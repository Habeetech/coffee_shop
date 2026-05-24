import CartItem from "./CartItem.jsx";
import useCartStore from "../../store/useCartStore.js";
import "./CartPanel.css";
import { Link } from "react-router-dom"

export default function CartPanel() {
  const carts = useCartStore(state => state.carts);
  const total = useCartStore(state => state.total());
  const clearCart = useCartStore(state => state.clearCart);
  const closeCart = useCartStore(state => state.closeCart);

  const expandedId = useCartStore(state => state.expandedId);
  const setExpandedId = useCartStore(state => state.setExpandedId);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="cart-panel-content">
      <div className="cart-header-wrapper">
        <h3 className="cart-header">Your Cart</h3>
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

      </div>
      <div className="cart-items">
        {carts.map(item => (
          <CartItem
            key={item.identityKey}
            item={item}
            isExpanded={expandedId === item.identityKey}
            onToggle={() => toggleExpand(item.identityKey)}
          />
        ))}
      </div>

      <div className="cart-footer">
        <p className="cart-totals">Total: £{Number(total).toFixed(2)}</p>
        <div className="cart-btns-wrapper">
          <Link to="/checkout"><button
            className="cart-checkout"
            onClick={closeCart}
          >Checkout</button></Link>
          <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
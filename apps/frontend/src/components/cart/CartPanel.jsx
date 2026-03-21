import CartItem from "./CartItem.jsx";
import useCartStore from "../../store/useCartStore.js";
import "./CartPanel.css";

export default function CartPanel() {
  const carts = useCartStore(state => state.carts);
  const total = useCartStore(state => state.total());
  const clearCart = useCartStore(state => state.clearCart);

  const expandedId = useCartStore(state => state.expandedId);
  const setExpandedId = useCartStore(state => state.setExpandedId);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="cart-panel-content">
      <h3 className="cart-header">Your Cart</h3>

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
          <button className="cart-checkout">Checkout</button>
          <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
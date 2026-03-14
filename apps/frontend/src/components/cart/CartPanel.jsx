import CartItem from "./CartItem.jsx";
import useCartStore from "../../store/useCartStore.js";
import "./CartPanel.css"
export default function CartPanel() {
  const carts = useCartStore(state => state.carts);
  const total = useCartStore(state => state.total());
  const clearCart = useCartStore(state => state.clearCart);

  return (
    <div className="cart-panel-content">
      <h3 id="cart-title" className="cart-header">Your Cart</h3>

      <div className="cart-items">
        {carts.map(item => (
          <CartItem key={item.identityKey} item={item} />
        ))}
      </div>

      <div className="cart-footer">
        <p className="cart-totals">Total: {total}</p>
      

      <div className="cart-btns-wrapper">
        <button className="cart-checkout">Checkout</button>
        <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
      </div>
      </div>
    </div>
  );
}
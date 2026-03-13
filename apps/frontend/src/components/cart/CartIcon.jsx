import { getDescription } from "../../utils/getDescription";
import cartIcon from "../../assets/icons/cart.png";
import { useState } from "react";
import useCartStore from "../../store/useCartStore.js"
import "./CartIcon.css"

export default function CartIcon() {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const itemCount = useCartStore(state => state.carts.length) || 1;

    return (
        <button className="cart-icon-wrapper"
            onClick={() => setIsCartOpen(true)}
            tabIndex="0"
            aria-label="Open cart"
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    setIsCartOpen(true);
                }
            }}
        >
            <figure className="cart-icon">
                <img src={cartIcon} alt={getDescription(cartIcon)} />
            </figure>
            {itemCount > 0 ?  <div className="cart-badge"
                aria-live="polite"
            >{itemCount}</div> : ""}
        </button>
    )
}
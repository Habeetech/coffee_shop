import { getDescription } from "../../utils/getDescription";
import cartIcon from "../../assets/icons/cart.png";
import { useEffect, useRef, useState } from "react";
import useCartStore from "../../store/useCartStore.js"
import "./CartIcon.css"

export default function CartIcon() {

    const itemCount = useCartStore(state => state.carts.length)
    const openCart = useCartStore(state => state.openCart)
    const cartIconRef = useRef(null);
    const setCartIconRef = useCartStore(state => state.setCartIconRef)

    useEffect(() => {
        setCartIconRef(cartIconRef)
    }, [])
    return (
        <button className="cart-icon-wrapper"
            onClick={() => openCart()}
            tabIndex="0"
            aria-label="Open cart"
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    openCart();
                }
            }}
            ref={cartIconRef}
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
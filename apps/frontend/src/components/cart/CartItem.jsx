import { getDescription } from "../../utils/getDescription";
import useCartStore from "../../store/useCartStore";
import "./CartItem.css"
export default function CartItem ({item}) {
    const {name, price, quantity, url, options} = item;
    const removeItem = useCartStore(state => state.removeItem);
    const increment = useCartStore(state => state.increment)
     const decrement = useCartStore(state => state.decrement)
    return(
        <>
        <div className="cartItem-wrapper">
            <figure className="item-image-wrapper"><img src={url} alt={getDescription(url)}/></figure>
            <p className="item-name">{name}</p>
            <p className="item-price">{price}</p>
            <div className="quantity-wrapper">
            <button className="decrement"
                onClick={() => decrement(item)}
                aria-label="Decrease quantity"
            >-</button>
            <p aria-live="polite" className="item-quantity">{quantity}</p>
            <button className="increment"
                onClick={() => increment(item)}
                aria-label="Increase quantity"
            >+</button>
            </div>
            <button className="remove"
                onClick={() => removeItem(item)}
            >Remove</button>
        </div>
        <p className="item-options">{options}</p>
        </>
    )
}
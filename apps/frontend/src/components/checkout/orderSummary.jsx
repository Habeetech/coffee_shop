import { getDescription } from "../../utils/getDescription.js";
import "./OrderSummary.css"
export default function OrderSummary ({carts}) {
    return (<>
      <h3 className="cart-summary-title">Order Summary</h3>
                    {carts.map(cartItem => <div
                        key={cartItem.identityKey}
                        className="cart-summary-item"
                    >
                        {/* <figure>
                <img src={cartItem.url} alt={getDescription(cartItem.url)}/>
            </figure> */}
                        <p>Name: {cartItem.name}</p>
                        <p>Price: £ {Number(cartItem.price).toFixed(2)}</p>
                        <p>Quantity: {cartItem.quantity}</p>
                    </div>)}
    </>)
}
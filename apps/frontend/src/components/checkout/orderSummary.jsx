import { getDescription } from "../../utils/getDescription.js";

import FormSection from "../form/FormSection.jsx";
export default function OrderSummary ({carts}) {
    return (<FormSection 
    title="Order Summary"
    >
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
    </FormSection>)
}
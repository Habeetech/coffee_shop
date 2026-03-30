import "./DeliveryOptions.css"
export default function DeliveryOptions({
    customer,
    errors,
    handleCustomerChange,
}) {
    return (<fieldset className="delivery-option">
        <legend>Please choose your delivery/collection method</legend>
        <input
            id="pickup"
            type="radio"
            name="deliveryOption"
            value="pickup"
            checked={customer.deliveryOption === "pickup"}
            onChange={(e) => handleCustomerChange(e.target)}></input>
        <label htmlFor="pickup">Pick Up</label>
        <input
            id="delivery"
            type="radio"
            name="deliveryOption"
            value="delivery"
            onChange={(e) => handleCustomerChange(e.target)}
            checked={customer.deliveryOption === "delivery"} ></input>
        <label htmlFor="delivery">Delivery</label>
        {errors.deliveryOption && <p className="error">{errors.deliveryOption}</p>}
    </fieldset>)
}